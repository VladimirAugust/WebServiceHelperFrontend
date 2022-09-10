<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="https://getbootstrap.com/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="30" height="24">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="user_data['is_signed_up']">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" v-on:click="push_user_page" id="profile">Мой профиль</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" aria-current="page" v-on:click="push_user_goods" id="my-goods">Мои товары/услуги</a>
              </li>
            </ul>
            <span class="navbar-text">{{ user_data["balance"] }} даров</span>
          </div>
          <form class="form-inline">
              <div v-if="!user_data['is_signed_up']">
                <a v-on:click="push_login_page" class="auth-button">Войти</a>
                <a v-on:click="push_register_page" class="auth-button">Зарегестрироваться</a>
              </div>
              <div v-else>
                <a class="nav-link active" aria-current="page" v-on:click="UserExit">Выйти</a>
              </div>
            </form>
        </div>
      </nav>
    </header>
    <router-view v-on:LoginAuth="on_auth($event)"/>
    </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      user_data: {
        "is_signed_up": false
      }
    }
  },
  async mounted(){  
    await this.get_user_data()
  },
  methods: {
    UserExit(){
      localStorage.removeItem('token');
      this.$router.go("/")
    },
    
    push_user_page(){
      document.getElementById("profile").classList.add("active")
      document.getElementById("my-goods").classList.remove("active")
      this.$router.push({
        name: "UserPage",
        params: {
          "pk": this.user_data["pk"]
        }
      })
    },

    push_user_goods(){
      document.getElementById("profile").classList.remove("active")
      document.getElementById("my-goods").classList.add("active")
      this.$router.push({
        name: "MyGoodsPage",
        params: {
          "pk": this.user_data["pk"]
        }
      })
    },

    push_register_page(){
      this.$router.push({
        "name": "RegisterPage"
      })
    },

    push_login_page(){
      this.$router.push({
        "name": "LoginPage"
      })  
    },
    
    async set_user_data(data, is_signed_up){
      this.user_data = data
      this.user_data.is_signed_up = is_signed_up;
    },

    async on_auth(){
      await this.get_user_data()
      this.$router.push(
        "user/" + this.user_data["pk"]
      )
    },

    async get_user_data(){
      if (localStorage.token){
        this.token = localStorage.token
        this.response = await fetch(this.$api_host + "api/profile", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + this.token
          }})
        if (await this.response.status === 200){
          await this.set_user_data(await this.response.json(), true)
        }
        else if (await this.response.status === 401){
          localStorage.removeItem('token');
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.auth-button {
  box-shadow:inset 0px 1px 0px 0px #ffffff;
  background-color:#f9f9f9;
  border-radius:6px;
  border:1px solid #dcdcdc;
  display:inline-block;
  cursor:pointer;
  color:#666666;
  font-family:Arial;
  font-size:15px;
  font-weight:bold;
  padding:6px 24px;
  text-decoration:none;
  text-shadow:0px 1px 0px #ffffff;
  margin-right: 2rem;
}
.auth-button:hover {
  background-color:#e9e9e9;
}
.auth-button:active {
  position:relative;
  top:1px;
}
.profile-image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-right: 0.7rem;
  border: 1px solid black;
}
.username-btn {
  margin-right: 2rem;
}



</style>
