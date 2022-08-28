<template>
  <tr>
    <th><p class="text-end">{{ label }}:</p></th>
    <td v-if="!editable">
      <p v-if="type==='select'">
        {{ options[value] }}
      </p>
      <p v-else-if="type==='cost-optional'">
        {{cost_optional_display}}
      </p>
      <p v-else-if="type==='checkbox'">
        {{checkbox_display}}
      </p>
      <p v-else>
        {{value}}
      </p>
    </td>
    <td v-else-if="type==='input'">
      <input type="text" v-model="value" @keyup="$emit('update:value', value);"/>
    </td>
    <td v-else-if="type==='textarea'">
      <textarea cols="40" rows="10" v-model="value" @keyup="$emit('update:value', value);"></textarea>
    </td>
    <td v-else-if="type==='select'">
      <select v-model="value" @change="$emit('update:value', value);">
        <option v-for="i in Object.keys(options)" :key="i" :value="i">{{ options[i] }}</option>
      </select>
    </td>
    <td v-else-if="type==='cost-optional'">
      <input type="checkbox" v-model="cost_optional_chbox" name="" @change="cost_optional_chbox_change">
      <input v-if="cost_optional_chbox" type="number" v-model="value" min="0" max="9999999" step="0.01" @change="$emit('update:value', value);">
    </td>
    <td v-else-if="type==='checkbox'">
      <input type="checkbox" v-model="value" @change="$emit('update:value', value);">
    </td>
    <td><p class="text-danger">{{error_text}}</p></td>
  </tr>

</template>

<script>
export default {
  name: "ModelField",
  props: {
    label: String,
    value: [String, Number, Boolean],
    error_text: String,
    editable: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'input'
    },
    options: Object,
  },
  data () {
    return {
      "cost_optional_chbox": true
    }
  },
  created() {
    setTimeout(() => {
      if (this.type==='cost-optional') {
        console.log("value", this.value);
        if (['-1.00', '-1', -1].includes(this.value)) {
          this.cost_optional_chbox = false
        }
      }
    }, 1000)
  },
  computed: {
    cost_optional_display() {
      if (!isNaN(this.value) && Number(this.value) < 0) {
        return "-"
      } else {
        return this.value + '₽'
      }
    },
    checkbox_display() {
      return this.value ? "да" : "нет";
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    cost_optional_chbox_change(event) {
      if (this.cost_optional_chbox) {
        if (Number(this.value) < 0) {
          this.value = '0';
        }
      } else {
        this.value = '-1';
      }
      this.$emit('update:value', this.value);
    }
  }

}
</script>

<style scoped>

</style>