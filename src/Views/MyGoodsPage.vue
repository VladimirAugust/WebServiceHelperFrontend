<template>
  <div class="container-sm" style="margin-top: 4rem">
    <button type="button" class="btn btn-primary mb-3">Добавить товар/услугу</button>
    <div class="list-group">
      <a v-for="good in goods" :key="good.id" v-on:click="push_good(good.id)" class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ good.name }}</h5>
          <small>Последнее изменение: {{ format_time(good.updated_at) }}</small>
        </div>
        <p class="mb-1">{{ good.description }}</p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyGoodsPage",
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
    },
    format_time(isotime) {
      const d = new Date(isotime);
      const date = d.toLocaleDateString('ru-RU', );
      const time = d.toLocaleTimeString('ru-RU', { timeStyle: 'short', hour12: false, timeZone: 'UTC' });
      return date + " " + time;
    }
  }
}
</script>

<style scoped>

</style>