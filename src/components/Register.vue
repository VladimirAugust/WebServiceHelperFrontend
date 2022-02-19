<template>
  <div class="container-sm" style="margin-top: 4rem">
    <h2 style="text-align: center">Sign Up</h2>
    <hr>
    <form @submit.prevent="register" style="margin-top: 2rem">
      <div class="mb-3" id="email">
        <label for="InputEmail" class="form-label">Email address</label>
        <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp">
        <small id="emailHelp" class="form-text">We'll never share your email with anyone else.</small>
      </div>
      <div class="mb-3" id="username">
        <label for="InputUsername" class="form-label">Username</label>
        <input type="text" class="form-control" id="InputUsername">
      </div>
      <div class="mb-3" id="password">
        <label for="InputPassword" class="form-label">Password</label>
        <input type="password" class="form-control" id="InputPassword">
        <span class="fa fa-fw fa-eye field-icon" id="passwordController" v-on:click="ChangePasswordVisibility"></span>
      </div>
      <button type="submit" class="btn btn-primary">Sing up</button>
      <a @click.prevent="go_login_page" style="margin-left: 2.5rem">I already have an account</a>
    </form>
  </div>
</template>

<script>
export default {
  name: "Register",
  async beforeMount(){
    if (await this.is_link_valid()){
      console.log("valid")
    } else {
      this.$router.push({
        "name": "PageNotFound",
        "params": {}
      })
    }

  },
  methods: {
    ChangePasswordVisibility(){
      var passwordController = document.getElementById("passwordController")
      passwordController.classList.toggle("fa-eye")
      passwordController.classList.toggle("fa-eye-slash")
      var PasswordInput = document.getElementById("InputPassword")
      console.log(PasswordInput)
      if (PasswordInput.getAttribute("type") === "password"){
        PasswordInput.setAttribute("type", "text")
      } else {
        PasswordInput.setAttribute("type", "password")
      }
    },

    async register() {
      this.hash = this.$route.params.hash
      this.response = await fetch(this.$api_host+"api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "username": document.getElementById("InputUsername").value,
          "email": document.getElementById("InputEmail").value,
          "password": document.getElementById("InputPassword").value,
          "url_hash": this.hash
        })
      })
      this.response_json = await this.response.json()
      if (await this.response.status === 200){
        localStorage.token = this.response_json["token"]
        this.$emit("LoginAuth")
        this.$router.push("/settings")
    
      }else if (await this.response.status === 400){
        var data = this.response_json
        
        for (const [key, value] of Object.entries(data)){
            var block = document.getElementById(key)
            block.getElementsByTagName("input")[0].classList.add("is-invalid")
            block.getElementsByTagName("label")[0].classList.add("text-danger")
            var helpTexts = block.getElementsByTagName("small")
            if (helpTexts.length === 0){
                console.log(helpTexts.length)
                var helpText = document.createElement("small")
                helpText.innerHTML = '<small id="passwordHelp" class="text-danger">'+value+'</small>'
                block.appendChild(helpText);
            }else {
                helpTexts[0].innerText = value
				helpTexts[0].classList.add("text-danger")
            }
        }
    }},

    async is_link_valid() {
      if (localStorage.token) {
        alert("You're already loggined in")
        return false;
      }

      this.hash = this.$route.params.hash
      this.response = await fetch(this.$api_host+"api/registerPage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "url_hash": this.hash
          })
        })
      console.log(await this.response.status)
      return await this.response.status === 200;

    }
  }
}
</script>

<style scoped>
.field-icon {
  float: right;
  margin-left: -25px;
  margin-top: -25px;
  position: relative;
  z-index: 2;
}
</style>
