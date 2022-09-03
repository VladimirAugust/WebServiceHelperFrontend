<template>
  <div class="d-flex w-100 justify-content-between">
    <h5 class="mb-1">{{ good.name }}</h5>
<!--    <p class="mb-1">{{ good.state }}</p>-->
    <small>Последнее изменение: {{ format_time(good.updated_at) }}</small>
  </div>
</template>

<script>
export default {
  name: "GoodSmallPreview",
  props: {
    good: Object
  },
  methods: {
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