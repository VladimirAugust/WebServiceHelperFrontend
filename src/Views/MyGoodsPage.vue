<template>
  <div class="container-sm" style="margin-top: 4rem">
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <button class="nav-link active" id="nav-1-tab" data-bs-toggle="tab" data-bs-target="#nav-1" type="button" role="tab" aria-controls="nav-1" aria-selected="true">Опубликованные</button>
        <button class="nav-link" id="nav-2-tab" data-bs-toggle="tab" data-bs-target="#nav-2" type="button" role="tab" aria-controls="nav-2" aria-selected="false">Черновики</button>
        <button class="nav-link" id="nav-3-tab" data-bs-toggle="tab" data-bs-target="#nav-3" type="button" role="tab" aria-controls="nav-3" aria-selected="false">На модерации</button>
        <button class="nav-link" id="nav-4-tab" data-bs-toggle="tab" data-bs-target="#nav-4" type="button" role="tab" aria-controls="nav-4" aria-selected="false">Проданные</button>
        <button class="nav-link" id="nav-5-tab" data-bs-toggle="tab" data-bs-target="#nav-5" type="button" role="tab" aria-controls="nav-5" aria-selected="false">Удалённые</button>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade show active" id="nav-1" role="tabpanel" aria-labelledby="nav-1-tab">
        <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
        <a v-for="good in goods" :key="good.id" v-on:click="push_good(good.id)" v-if="good.state===3" class="list-group-item list-group-item-action flex-column align-items-start">
          <GoodSmallPreview :good="good"/>
        </a>
      </div>
      <div class="tab-pane fade" id="nav-2" role="tabpanel" aria-labelledby="nav-2-tab">
        <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
        <a v-for="good in goods" :key="good.id" v-on:click="push_good(good.id)" v-if="good.state===0" class="list-group-item list-group-item-action flex-column align-items-start">
          <GoodSmallPreview :good="good"/>
        </a>
      </div>
      <div class="tab-pane fade" id="nav-3" role="tabpanel" aria-labelledby="nav-3-tab">
        <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
        <a v-for="good in goods" :key="good.id" v-on:click="push_good(good.id)" v-if="[1,2].includes(good.state)" class="list-group-item list-group-item-action flex-column align-items-start">
          <GoodSmallPreview :good="good"/>
        </a>
      </div>
      <div class="tab-pane fade" id="nav-4" role="tabpanel" aria-labelledby="nav-4-tab">
        <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
        <a v-for="good in goods" :key="good.id" v-on:click="push_good(good.id)" v-if="good.state===5" class="list-group-item list-group-item-action flex-column align-items-start">
          <GoodSmallPreview :good="good"/>
        </a>
      </div>
      <div class="tab-pane fade" id="nav-5" role="tabpanel" aria-labelledby="nav-5-tab">
        <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
        <a v-for="good in goods" :key="good.id" v-on:click="push_good(good.id)" v-if="good.state===4" class="list-group-item list-group-item-action flex-column align-items-start">
          <GoodSmallPreview :good="good"/>
        </a>
      </div>
    </div>
  </div>

</template>

<script>
import GoodSmallPreview from "@/components/GoodSmallPreview";
export default {
  name: "MyGoodsPage",
  components: {GoodSmallPreview},
  data(){
    return {
      "goods": {
      }
    }
  },
  mounted() {
    this.load_settings()
  },
  methods: {
    async load_settings() {
      var response = await fetch(this.$api_host+"api/trade/good/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.token
        }
      })

      if (await response.status === 200){
        var data = await response.json()
        this.goods = data
        console.log(data)

      } else if (await response.status === 401){
        this.$router.push("/login")
      }

    },
    push_good(pk){
      this.$router.push({
        name: "GoodPage",
        params: {
          "pk": pk
        }
      })
    }
  }
}
</script>

<style scoped>
.project-tab {
  padding: 10%;
  margin-top: -8%;
}
.project-tab #tabs{
  background: #007b5e;
  color: #eee;
}
.project-tab #tabs h6.section-title{
  color: #eee;
}
.project-tab #tabs .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
  color: #0062cc;
  background-color: transparent;
  border-color: transparent transparent #f3f3f3;
  border-bottom: 3px solid !important;
  font-size: 16px;
  font-weight: bold;
}
.project-tab .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: .25rem;
  border-top-right-radius: .25rem;
  color: #0062cc;
  font-size: 16px;
  font-weight: 600;
}
.project-tab .nav-link:hover {
  border: none;
}
.project-tab thead{
  background: #f3f3f3;
  color: #333;
}
.project-tab a{
  text-decoration: none;
  color: #333;
  font-weight: 600;
}
</style>