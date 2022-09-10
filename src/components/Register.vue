<template>
  <div class="container-sm" style="margin-top: 4rem">
    <h2 style="text-align: center">Регистрация</h2>
    <hr>
    <form @submit.prevent="register" style="margin-top: 2rem">
    <p>
      Для прохождение регистрации вам нужен получить код в телеграм боте: <a target="_blank" rel="noopener noreferrer"  href="https://t.me/mutual_aid_info_bot">@mutual_aid_info_bot</a>
    </p>
    <p>
      Используя наш телеграм бот, вы в будущем будете получать уведомления посредством этого бота
    </p>
      <div class="mb-3 mx-5" id="code">
        <label for="InputCode" class="form-label">Код</label>
        <input type="phone" class="form-control" id="InputCode" aria-describedby="codeHelp">
      </div>
      <button type="submit" class="btn btn-primary">Подтвердить</button>
    </form>
  </div>
</template>


<script>
export default {
  name: "Register",
  methods: {
    async register() {
      this.response = await fetch(this.$api_host+"api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "code": document.getElementById("InputCode").value
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
    }}
  }
}
</script>
