<template>
    
    <div class="container rounded bg-white mt-5 mb-5">
    <div class="row">
        <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="rounded-circle mt-5" width="150px" :src="userData['avatar']" ><span class="font-weight-bold">{{userData["username"]}}</span><span class="text-black-50">{{userData["email"]}}</span><span> </span></div>
            <div class="input-group">
        <input class="form-control" type="file" id="formFileMultiple" accept="image/*" multiple>
        </div>
        <button class="btn btn-dark edit-btn mt-3" v-on:click="change_avatar">Изменить</button> 
        </div>
        <div class="col-md-5 border-right">
            <div class="p-3 py-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-right">Общие настройки</h4>
                </div>
                <div class="row mt-2">
                    <div class="col-md-6"><label class="labels">Name</label><input type="text" class="form-control" id="FirstNameInput" placeholder="first name" value=""></div>
                    <div class="col-md-6"><label class="labels">Surname</label><input type="text" class="form-control" id="LastNameInput" value="" placeholder="surname"></div>
                </div>
                <div class="row mt-3"> 
                    <div class="col-md-12" id="phone_number"><label class="labels">Mobile Number</label><span class="required">*</span><input type="tel" id="telInput" data-tel-input class="form-control" placeholder="enter phone number" value=""></div>
                    <div class="col-md-12" id="city"><label class="labels">Город</label><span class="required">*</span><input type="text" class="form-control" placeholder="Введите ваш город" id="CityInput" value=""></div>
                    <div class="col-md-12" id="district"><label class="labels">Район</label><span class="required">*</span><input type="text" class="form-control" placeholder="Введите ваш район" id="DiscrictInput" value=""></div>
                </div>
                <div class="mt-5 text-center"><button class="btn btn-primary profile-button" type="button" v-on:click="change_settings">Save Profile</button></div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="p-3 py-5">
                <div class="d-flex justify-content-between align-items-center mb-3"><h4 class="text-right" style="text-align: center;">Настройки Пользователя</h4></div>
                <div class="row mt-2">
                    <div class="col-md-6"><label class="labels">Password</label><input type="password" class="form-control" placeholder="password" id="old_password" value=""></div>
                    <div class="col-md-6"><label class="labels">New Password</label><input type="password" class="form-control" value="" id="new_password" placeholder="new password"></div>
                    
                </div>
                <div class="d-flex justify-content-center mt-4 align-items-center experience "><span class="border px-3 p-1 add-experience" v-on:click="change_password">Изменить пароль</span></div><br>
            </div>
        </div>
    </div>
    
</div>
</template>

<script>    
export default ({
    name: "UserSettingsPage",
    data(){
        return {
            "userData": {

            }
        }
    },
    mounted() {
    this.load_settings()

    var phoneInputs = document.querySelectorAll('input[data-tel-input]');

    var getInputNumbersValue = function(input) {
        // Return stripped input value — just numbers
        return input.value.replace(/\D/g, '');
    }

    var onPhonePaste = function(e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                // formatting will be in onPhoneInput handler
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    var onPhoneInput = function(e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            // Editing in the middle of input, not last symbol
            if (e.data && /\D/g.test(e.data)) {
                // Attempt to input non-numeric symbol
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    }
    var onPhoneKeyDown = function(e) {
        // Clear input after remove last symbol
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }
    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }
    },
    methods: {
        async change_avatar(){
            var fileInput = document.getElementById("formFileMultiple")
            var formData = new FormData()
            formData.append('avatar', fileInput.files[0])
            for (var [key, value] of formData.entries()) {
            console.log(key, value);
            }
            var response = await fetch(this.$api_host+"api/image/upload", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
                    "Authorization": "Token " + localStorage.token
                },
                body: formData
            })
            console.log(await response.json())
        },

        async change_password() {
            var old_password = document.getElementById("old_password").value
            var new_password = document.getElementById("new_password").value

            var response = await fetch(this.$api_host+"api/password/change", {
                method: "PATCH",
                headers: {
                    'Content-Type': 'text/plain; charset=UTF-8',
                    "Authorization": "Token " + localStorage.token
                },
                body: JSON.stringify({
                    "old_password": old_password,
                    "new_password": new_password
                })
            })

            if (await response.status === 200){
                alert("Password succesefuly changed")
            }
        },

        async load_settings() {
            var response = await fetch(this.$api_host+"api/settings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + localStorage.token
                }
            })

            if (await response.status === 200){
                var data = await response.json()
                this.userData = data
                console.log(data)

            } else if (await response.status === 401){
                this.$router.push("/login")
            }

            document.getElementById("FirstNameInput").value = data["first_name"]
            document.getElementById("DiscrictInput").value = data["district"]
            document.getElementById("telInput").value = data["phone_number"]
            document.getElementById("LastNameInput").value = data["last_name"]
            document.getElementById("CityInput").value = data["city"]
        },

        async change_settings() {
            var city = document.getElementById("CityInput").value
            var district = document.getElementById("DiscrictInput").value
            var phone = document.getElementById("telInput").value
            var first_name = document.getElementById("FirstNameInput").value
            var last_name = document.getElementById("LastNameInput").value

            console.log(city, district, phone, first_name)

            var response = await fetch(this.$api_host+"api/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + localStorage.token
                },
                body: JSON.stringify({
                    "city": city,
                    "district": district,
                    "phone_number": phone,
                    "first_name": first_name,
                    "last_name": last_name
                })
            })
            
            var status = await response.status
            if (status === 200){
                this.$router.go(this.$router.currentRoute)
            } else if (status === 400){
                var data = await response.json()
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
})
</script>

<style scoped>
body {
    background: rgb(99, 39, 120)
}

.form-control:focus {
    box-shadow: none;
    border-color: #BA68C8
}

.profile-button {
    background: rgb(99, 39, 120);
    box-shadow: none;
    border: none
}

.profile-button:hover {
    background: #682773
}

.profile-button:focus {
    background: #682773;
    box-shadow: none
}

.profile-button:active {
    background: #682773;
    box-shadow: none
}

.back:hover {
    color: #682773;
    cursor: pointer
}

.labels {
    font-size: 11px
}

.add-experience:hover {
    background: #BA68C8;
    color: #fff;
    cursor: pointer;
    border: solid 1px #BA68C8
}

.required
{
    color: red;
}
</style>