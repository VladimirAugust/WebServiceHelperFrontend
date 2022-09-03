<template>

  <div class="container rounded bg-white mt-5 mb-5">
    <button @click="$router.push({name: 'MyGoodsPage'})" class="float-start">К списку товаров</button>
        <h2>{{extra_message}}</h2>
    <table class="table">

        <ModelField ref="name" label="Название" :value.sync="good.name" :editable="allow_edit" :error_text="errors.name"/>

      <tr>
        <th><p class="text-end">Категория:</p></th>
        <td><GoodCategoryChooser/></td>
      </tr>

        <ModelField label="Статус" :value="good_state"/>

        <ModelField v-if="good.state===2" label="Причина отказа модератором" :value="good.moderation_disallow_reason"/>

        <ModelField label="Описание" :value.sync="good.description" :editable="allow_edit" type="textarea" :error_text="errors.description"/>

        <ModelField label="Состояние товара" :value.sync="good.condition" :editable="allow_edit" type="select" :options="get_condition_options()" :error_text="errors.condition"/>

        <ModelField label="Стоимость, ₽" :value.sync="good.price_currency" :editable="allow_edit" type="cost-optional" :error_text="errors.price_currency"/>
        <ModelField label="Стоимость в дарах" :value.sync="good.price_gifts" :editable="allow_edit" type="cost-optional" :error_text="errors.price_gifts"/>
        <ModelField label="Готов обменять" :value.sync="good.ready_to_change" :editable="allow_edit" type="checkbox" :error_text="errors.ready_to_change"/>
        <ModelField label="Контакты" :value.sync="good.contacts" :editable="allow_edit" type="textarea" :error_text="errors.contacts"/>

        <tr>
          <th><p class="text-end">Фотографии:</p></th>
          <td>
            <UploadMedia
                v-if="action==='new'"
                ref="media"
                :server="this.$api_host + 'api/trade/upload'"
                :error="media_error">
            </UploadMedia>
            <UpdateMedia
                v-else-if="action==='edit'"
                ref="media"
                :server="this.$api_host + 'api/trade/upload'"
                :error="media_error"
                :media_file_path="this.$api_host + 'media'"
                :media_server="this.$api_host + 'api/trade/media/' + this.$route.params.pk">
            </UpdateMedia>
            <img v-else
                 v-for="img in good.images_for_read"
                 :key="img"
                 :src="$api_host + 'media/' + img"
                 class="img-thumbnail"
                 style="max-height: 200px"
            >
          </td>
        </tr>
      <tr><td colspan="2">
        <button v-if="allow_edit" @click="btn_draft()">Сохранить как черновик</button>
        <button v-if="allow_edit" @click="btn_publish()">Опубликовать</button>
        <button v-if="action==='edit'" @click="btn_delete()">Удалить</button>
        <button v-if="action==='edit'" @click="btn_sold()">Отметить как проданное</button>
        <button v-if="action==='get' && good.is_author===true" @click="open_for_edit()">Редактировать</button>
      </td></tr>
      <tr><td colspan="2"><p id="status"></p></td></tr>

    </table>

  </div>
</template>

<script>
import ModelField from "@/components/ModelField";
import $ from "jquery";
import UpdateMedia from "@/components/UpdateMedia";
import UploadMedia from "@/components/UploadMedia";
import GoodCategoryChooser from "@/components/GoodCategoryChooser";


export default {
  name: "GoodPage",
  components: {ModelField, UploadMedia, UpdateMedia, GoodCategoryChooser },
  data(){
    return {
      "good": {},
      "action": undefined,
      "errors": {},
      "media_error": null,
      "good_images": [],
    }
  },
  mounted() {
    this.clear_errors();
    this.load_settings();
  },
  computed: {
    allow_edit() {
      return this.action === 'edit' || this.action === 'new';
    },
    good_state() {
      const conditions = {
        0: "Черновик",
        1: "На модерации",
        2: "Запрещено модератором",
        3: "Опубликовано",
        4: "Удалено",
        5: "Продано",
      }
      return conditions[this.good.state];
    },
    extra_message() {
      return this.$route.params.extra_message;
    }

  },
  methods: {
    async load_settings() {
      this.pk = this.$route.params.pk
      this.action = this.$route.params.action
      // localStorage.token = '04948fcc522779e171384c12eadef82e3b106bb6'
      if (this.pk === 'new') {
        this.good = {
        }
        this.action = 'new'
        return;
      } else if (this.action === 'edit') {
        console.log()
      } else if (this.action === undefined && !isNaN(this.pk)) {
        this.action = 'get';
      } else {
        await this.$router.push({name: "PageNotFound"});
      }
      const response = await fetch(this.$api_host+"api/trade/good/"+this.pk, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.token
        }
      })

      if (await response.status === 200){
        const data = await response.json()
        this.good = data
        console.log("Good data", data);
      } else if (await response.status === 401){
        await this.$router.push("/login")
      } else {
        await this.$router.push({name: "PageNotFound"});
      }

    },
    clear_errors() {
      this.errors = {
        "name": "",
        "category": "",
        "description": "",
        "condition": "",
        "price_currency": "",
        "price_gifts": "",
        "ready_to_change": "",
        "contacts": "",
        "images": "",
      };
    },


    async send_good (btn_action) {
      this.clear_errors();
      let images = []
      if (this.action === 'new') {
        images = this.$refs.media.media.map(value => value.name);
      } else {
        images = [...this.$refs.media.added_media.map(value => value.name), ...this.$refs.media.saved_media.map(value => value.name)];
      }
      $('#status').show().text("Подождите...");
      const obj_to_save = {
        'category': this.good.category,
        'condition': this.good.condition,
        'contacts': this.good.contacts,
        'description': this.good.description,
        'images': images,
        'name': this.good.name,
        'price_currency': this.good.price_currency,
        'price_gifts': this.good.price_gifts,
        'ready_to_change': this.good.ready_to_change,
      }

      let url = this.$api_host + "api/trade/good/";
      if (this.action === 'edit') {
        url += this.pk + '/'
      }
      url += "?action=" + btn_action;
      const json_to_send = JSON.stringify(obj_to_save);
      // console.log("JSON", json_to_send);
      const response = await fetch(url, {
        method: this.action === 'new' ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.token
        },
        body: json_to_send
      })
      console.log("Response ", response);
      if (await response.status === 200) {
        const data = await response.json()
        this.good.state = data.state
        $('#status').text("Сохранено");
        $('#status').show().fadeOut(2000);
      } else if (await response.status === 201) {
        $('#status').text("Успешно создано");
        $('#status').show().fadeOut(2000);
        const data = await response.json()
        await this.$router.push({name: "GoodPageAction", params: {
          action: 'edit',
          pk: data['id'],
          extra_message: 'Успешно создан'
        }});
        this.$router.go();
      } else if (await response.status === 400) {
        const data = await response.json()
        console.log("Response", data);
        $('#status').show().text("Произошла ошибка. Обратите внимание на ошибки выше");
        for (let k in data) {
          this.errors[k] = data[k].join("; ");
        }
      } else if (await response.status === 401) {
        await this.$router.push("/login")
      } else {
        $('#status').show().text("Произошла ошибка. Попробуйте перезагрузить страницу");
      }
    },

    async btn_draft() {
      await this.send_good('draft');
    },

    async btn_publish() {
      await this.send_good('publish');
    },
    async btn_delete() {
      await this.send_good('delete');
    },
    async btn_sold() {
      await this.send_good('sold');
    },
    async open_for_edit() {
      await this.$router.push({name: "GoodPageAction", params: {
          action: 'edit',
          pk: this.pk,
        }});
      this.$router.go();
    },

    get_condition_options() {
      return {
        1: "Б/у в очень плохом состоянии",
        2: "Б/у в плохом состоянии",
        3: "Б/у в хорошем состоянии, без гарантии",
        4: "Б/у в отличном состоянии с гарантией",
        5: "Абсолютно новое",
      };
    },

  }
}
</script>

<style scoped>

</style>