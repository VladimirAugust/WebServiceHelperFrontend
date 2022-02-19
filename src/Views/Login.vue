<template>
  <div class="container-sm" style="margin-top: 4rem">
    <h2>Sign In</h2>
    <hr>
    <form @submit.prevent="login">
      <div class="mb-3" id="email">
        <label for="InputEmail" class="form-label">Email address</label>
        <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp">
      </div>
      <div class="mb-3" id="password">
        <label for="InputPassword" class="form-label">Password</label>
        <input type="password" class="form-control" id="InputPassword">
        <span class="fa fa-fw fa-eye field-icon" id="passwordController" v-on:click="ChangePasswordVisibility"></span>
      </div>
      <div style="margin-top: 2rem">
      <button type="submit" class="btn btn-primary">Sing In</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
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
    
    async login(){
      if (typeof localStorage.token !== "undefined"){
        alert("You're already loggined in")
        return;
      }
      this.email = document.getElementById("InputEmail").value
      this.password = document.getElementById("InputPassword").value
      this.response = await fetch(this.$api_host+"api/login", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"user": {
            "email": this.email,
            "password": this.password
          }
        })})
      if (await this.response.status === 200){
        this.response_json = await this.response.json()
        localStorage.token = this.response_json["token"]
        this.$emit("LoginAuth")
        // await this.$router.push({
        //   name: "HomePage"
        // })
      } else if (await this.response.status === 400){
        var data = await this.response.json()
        console.log(data)
        
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
      }
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
