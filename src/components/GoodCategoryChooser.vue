<template>
  <div>
    <p>{{ category_display }}</p>
    <button v-if="editable" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Выбрать
    </button>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Выбор категории</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p v-if="error_text!==''">{{ error_text }}</p>

            <div v-else class="row-root-qvv64 cascader-table-root-lxy9B row-root_padding_none-u_e1C" data-marker="category-wizard">
              <div class="column-root-rGwbF cascader-table-row-container-Ri1mQ width-width-flex-9-VuMI1 column-has_width-YQuuR">
                <div class="cascader-table-row-KJppb">
                  <div class="cascader-table-column-y0L3b">
                    <div v-for="cat in levels[0]" :key="cat.id" @click="lvl_select(0, cat)" data-marker="category-wizard/button" class="cascader-table-category-Ej4H0 text-text-OBRYG text-size-s-m5aJE" :class="{ active: selected[0] && cat.id === selected[0].id }">{{cat.name}}</div>
                  </div>
                  <div v-if="levels[1].length > 0" class="cascader-table-column-y0L3b">
                    <div v-for="cat in levels[1]" :key="cat.id" @click="lvl_select(1, cat)" data-marker="category-wizard/button" class="cascader-table-category-Ej4H0 text-text-OBRYG text-size-s-m5aJE" :class="{ active: selected[1] && cat.id === selected[1].id }">{{cat.name}}</div>
                  </div>
                  <div v-if="levels[2].length > 0" class="cascader-table-column-y0L3b">
                    <div v-for="cat in levels[2]" :key="cat.id" @click="lvl_select(2, cat)" data-marker="category-wizard/button" class="cascader-table-category-Ej4H0 text-text-OBRYG text-size-s-m5aJE" :class="{ active: selected[2] && cat.id === selected[2].id }">{{cat.name}}</div>
                  </div>
                  <div v-if="levels[3].length > 0" class="cascader-table-column-y0L3b">
                    <div v-for="cat in levels[3]" :key="cat.id" @click="lvl_select(3, cat)" data-marker="category-wizard/button" class="cascader-table-category-Ej4H0 text-text-OBRYG text-size-s-m5aJE" :class="{ active: selected[3] && cat.id === selected[3].id }">{{cat.name}}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "GoodCategoryChooser",
  props: {
    value: Number,
    editable: Boolean,
  },
  data() {
    return {
      "error_text": '',
      "all_categories": null,
      "levels": [[], [], [], []],
      "selected": [null, null, null, null],
      "selected_cat_name": null,
    }
  },
  async mounted() {
    this.pk = this.$route.params.pk
    this.action = this.$route.params.action

    const response = await fetch(this.$api_host + "api/trade/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token " + localStorage.token
      }
    })

    if (await response.status === 200) {
      let data = await response.json()
      console.log("Cat data", data);
      this.all_categories = data;
      Vue.set(this.levels, 0, data)
    } else {
      this.error_text = 'Не удалось загрузить категории. Обновите страницу или обратитесь в поддержку'
    }
  },
  methods: {
    lvl_select(from_lvl, cat) {
      // console.log("From lvl " + from_lvl + "\tCat = " + cat)
      Vue.set(this.selected, from_lvl, cat);
      Vue.set(this.levels, from_lvl+1, cat.children);
      for (let i = from_lvl+1; i < 4; i++) {
        Vue.set(this.selected, i, null);
      }
      for (let i = from_lvl+2; i < 4; i++) {
        Vue.set(this.levels, i, []);
      }
      this.$emit('update:value', cat.id);
      this.selected_cat_name = cat.name;
    },
    _find_cat_name_by_id(id_to_find) {
      if (!this.all_categories) {
        return "загрузка...";
      }
      const cat_name = this._recursive_find_cat_name_by_id(id_to_find, this.all_categories);
      return cat_name ? cat_name : "(данной категории уже не существует, выберите ещё раз)";
    },
    _recursive_find_cat_name_by_id(id_to_find, parent_nodes) {
      for (let cat of parent_nodes) {
        // console.log(">>> ",parent_nodes, cat);
        if (cat.id === id_to_find) {
          return cat.name;
        } else {
          const res = this._recursive_find_cat_name_by_id(id_to_find, cat.children);
          if (res) return res;
        }
      }
      return null;
    },
    categories_cmp(a, b) {
      return b.sort_order - a.sort_order;
    }
  },
  computed: {
    category_display() {
      if (this.selected_cat_name) {
        return this.selected_cat_name;
      } else {
        return this._find_cat_name_by_id(this.value);
      }
    }
  }
}
</script>

<style scoped>
.modal-dialog{
  max-width: 1300px;
}
.cascader-header-root-Q2rRl {
  margin-top: 42px;
  margin-bottom: 6px;
}

.cascader-header-expanded-Walc8 {
  margin-bottom: 14px;
}

.cascader-header-hidden-b_Rit {
  /* stylelint-disable-next-line declaration-no-important */
  display: none !important;
}

.cascader-header-button-H3y95 {
  /* stylelint-disable-next-line declaration-no-important */
  padding: 0 !important;
  /* stylelint-disable-next-line declaration-no-important */
  min-height: 0 !important;
  /* stylelint-disable-next-line declaration-no-important */
  text-align: left !important;
}

/* Ð½ÐµÑ‚ ÐºÐ½Ð¾Ð¿ÐºÐ¸ Ñ€Ð°Ð·Ð¼ÐµÑ€Ð° xl */
.cascader-header-button-H3y95 > span {
  /* stylelint-disable-next-line declaration-no-important */
  font-size: 25px !important;
  /* stylelint-disable-next-line declaration-no-important */
  line-height: 30px !important;
}

.cascader-table-root-lxy9B {
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 20px;
  box-sizing: content-box !important; /* stylelint-disable-line declaration-no-important */
}

.cascader-table-root_hidden-ikK_2 {
  display: none !important; /* stylelint-disable-line declaration-no-important */
}

.cascader-table-row-container-Ri1mQ {
  padding-left: 0;
  padding-right: 0;
  box-sizing: content-box !important; /* stylelint-disable-line declaration-no-important */
}

.cascader-table-row-KJppb {
  display: flex;
}

.cascader-table-column-y0L3b {
  flex-grow: 1;
  flex-basis: 0;
  border: 1px solid #d8d8d8;
  padding-bottom: 10px;
}

.cascader-table-column_readonly-BGU3O {
  position: relative;
}

.cascader-table-column_readonly-BGU3O::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: '';
  background-color: rgba(255, 255, 255, .8);
}

.cascader-table-column-y0L3b + .cascader-table-column-y0L3b {
  border-left: 0;
}

.cascader-table-title-L2EY1 {
  padding: 12px 10px 10px;
}

.cascader-table-category-Ej4H0 {
  padding: 4px 10px;
  color: #555;
  cursor: pointer;
}

.cascader-table-category-Ej4H0:focus,
.cascader-table-category-Ej4H0:hover {
  background-color: #d9f3ff;
  color: #000;
}

.active,
.active:focus,
active:hover {
  background-color: #0af;
  color: #fff;
}

.cascader-hidden-L7QRu {
  display: none;
}
</style>