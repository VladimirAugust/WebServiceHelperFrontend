<template>
     <div style="display: flex; padding: 20px;">
    <div class="user-block" style="">
      <div class="img_container">
        <img :src="user_data['avatar']" class="user-image user-avatar-container">
        <div class="user-status" v-if="user_data['is_online']">
          <span class="indicator online"></span> Online
        </div>
        <div v-else class="user-status">
          <span class="indicator offline"></span> Offline
        </div>
      </div>

      <div class="user-info">
        <h2 class="username">{{user_data['first_name']}}</h2>
        <div class="user-description">{{user_data['description']}}</div>
      </div>
      <button v-if="user_data['is_current_user']" v-on:click="push_settings_page" class="btn btn-dark edit-btn">Редактировать</button>
      <button v-else-if="user_data['is_current_user_moderator']" class="btn btn-dark edit-btn" data-bs-toggle="modal" data-bs-target="#ConfirmBlock">Заблокировать пользователя</button>
    </div>
    <div class="modal fade" id="ConfirmBlock" tabindex="-1" aria-labelledby="ConfirmBlockLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ConfirmBlockLabel">Блокировка пользователя</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="reason">
          <label for="BlockReason" class="form-label">Причина блокировки</label>
          <textarea class="form-control" id="BlockReason" rows="3"></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
          <button type="button" class="btn btn-danger" v-on:click="block">Заблокировать</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default ({
    name: "UserPage",
    data() {
        return {
        user_data: "",
}
    },
    async mounted() {
        await this.load_user_data()
    },
    methods: {
    push_settings_page(){
      this.$router.push({
        name: "User settings"
      })
    },

    async block() {
      this.pk = this.$route.params.pk
      this.response = await fetch(this.$api_host+"api/user/ban", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.token
        },
        body: JSON.stringify({
          "pk": this.pk,
          "reason": document.getElementById("BlockReason").value
        })
      })
      if (await this.response.status === 200){
        this.$router.push("/home")
      } else {
        var data = await this.response.json()
        console.log(data)        
        for (const [key, value] of Object.entries(data)){
            var block = document.getElementById(key)
            console.log(block)
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
    },

    async load_user_data() {
      if (localStorage.token){
        this.auth_header = {"Authorization": "Token " + localStorage.token}
      }
      else {
        this.auth_header = {}
      }
      this.pk = this.$route.params.pk
      console.log(Object.assign({
          "Content-Type": "application/json",
        }, this.auth_header)
      )
      this.response = await fetch(this.$api_host+"api/user/" + this.pk, {
        method: 'GET',
        headers: Object.assign({
          "Content-Type": "application/json",
        }, this.auth_header)
      })
      console.log(this.response)
      this.status = await this.response.status
      if (await this.status === 200){
        this.user_data = await this.response.json()
        console.log(this.user_data)
      }
      else if (this.status === 404) {
        this.$router.push({
        "name": "PageNotFound",
        "params": {}
      })
      }

    }}
})
</script>


<style scoped>
.user-image {
  height: 200px;
  width: 200px;
  margin:0 auto;
}
.user-block {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.user-info {
  display: inline-block;
  vertical-align: top;
}
.username {
  font-size: 20px;
  margin-top: 20px;
  color: dodgerblue;
}
.user-avatar-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  display: inline-block;
  font-size: 0;
  max-width: 220px;
  padding: 10px;
  position: relative;
}
.user-status {
  position: absolute;
  color: white;
  top: 185px;
  left: 136px;
}
.user-description {
  /*display: inline-block;*/
  vertical-align: middle;
}
.img_container {
  position: relative;
}
.edit-btn {
  display: block;
  margin-top: 1.5rem;
}
.indicator.online {
  background: #28B62C;
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  -webkit-animation: pulse-animation 2s infinite linear;
}
@-webkit-keyframes pulse-animation {
  0% { -webkit-transform: scale(1); }
  25% { -webkit-transform: scale(1); }
  50% { -webkit-transform: scale(1.2) }
  75% { -webkit-transform: scale(1); }
  100% { -webkit-transform: scale(1); }
}
.indicator.offline {
  background: red;
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  -webkit-animation: pulse-animation 2s infinite linear;
}

</style>
