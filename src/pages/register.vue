  <template class="min-h-screen">
    <section class="bg-drogon bg-cover break-words bg-dice bg-center bg-fixed min-h-screen w-full items-center justify-center">
    <div class="break-words bg-black/90 flex flex-col items-center justify-center px-2 sm:px-6 py-8 mx-auto h-full lg:py-0">
       <div class="break-words md:my-5 w-full rounded-lg shadow">
          <div class="break-words p-4 space-y-4 md:space-y-6 sm:p-8">
            <div class="break-words flex items-center justify-between w-full mb-6 sm:mb-0">
              <h1 class="break-words text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                  Cadastro
              </h1>
              <div
                @click="returnLogin"
                class="break-words text-white hover:text-golden transition-colors sm:text-3xl text-2xl cursor-pointer"
              >
                <FontAwesomeIcon :icon="['fas', 'angle-left']" />
                <FontAwesomeIcon :icon="['fas', 'angle-left']" />
              </div>
            </div>
            <div class="break-words w-full">
              <div class="break-words mb-5">
                <label htmlFor="firstName" class="break-words block mb-2 text-sm font-medium text-white">Nome</label>
                <input 
                  type="firstName"
                  id="firstName"
                  v-model="firstName"
                  class="break-words shadow-sm bg-black border border-white text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400" 
                  placeholder="Insira seu primeiro nome" 
                  required 
                />
              </div>
              <div class="break-words mb-5">
                <label htmlFor="lastName" class="break-words block mb-2 text-sm font-medium text-white">Sobrenome</label>
                <input 
                  type="lastName"
                  id="lastName"
                  v-model="lastName"
                  class="break-words shadow-sm bg-black border border-white text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400" 
                  placeholder="Insira seu último nome" 
                  required 
                />
              </div>
              <div class="break-words mb-5">
                <label htmlFor="lastName" class="break-words block mb-2 text-sm font-medium text-white">Nickname</label>
                <input 
                  type="nick"
                  id="nick"
                  v-model="nickname"
                  class="break-words shadow-sm bg-black border border-white text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400" 
                  placeholder="Insira um Nick" 
                  required 
                />
              </div>
              <div class="break-words mb-5">
                <label htmlFor="email" class="break-words block mb-2 text-sm font-medium text-white">Email</label>
                <input 
                  type="email"
                  id="email"
                  v-model="email"
                  class="break-words shadow-sm bg-black border border-white text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400" 
                  placeholder="name@flowbite.com" 
                  required 
                />
              </div>
              <div class="break-words mb-5">
                <label htmlFor="description" class="break-words block mb-2 text-sm font-medium text-white">Escolha uma Imagem de perfil</label>
                  <input 
                    id="image"
                    name="image"
                    type="file"
                    @change="handleImage"
                    class="break-words shadow-sm bg-black border border-white text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
                  />
              </div>
              <div class="break-words mb-5">
                <label htmlFor="password" class="break-words block mb-2 text-sm font-medium text-white">Senha</label>
                <input 
                  type="password" 
                  id="password"
                  v-model="password"
                  class="break-words shadow-sm bg-black border border-white text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
                  placeholder="••••••" 
                  required 
                />
              </div>
              <div class="break-words mb-5">
                <label htmlFor="repeat-password" class="break-words block mb-2 text-sm font-medium text-white">Repita a Senha</label>
                <input 
                  type="password" 
                  id="repeat-password"
                  v-model="password2"
                  class="break-words shadow-sm bg-black border border-white text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
                  placeholder="••••••" 
                  required 
                />
              </div>
              <button 
                type="button"
                @click="handleRegister"
                class="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-golden to-dark-golden hover:from-dark-golden hover:to-golden hover:text-white focus:ring-4 focus:outline-none w-full"
              >
                <span class="break-words relative px-5 text-lg py-2.5 transition-all ease-in duration-75 text-white rounded-md group-hover:bg-opacity-0">
                  {{ loading ? 'Registrando, por favor aguarde' : 'Registrar' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { findNickByName, registerUser } from '../firebase/user';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core'
  library.add(faAngleLeft);
  export default {
    name: 'RegisterPage',
    components: {
      FontAwesomeIcon,
    },
    data() {
      return {
        nickname: '',
        loading: false,
        email: '',
        firstName: '',
        lastName: '',
        image: '',
        password: '',
        password2: '',
      }
    },
    methods: {
      handleImage(e) {
        if (e.target.files[0]) {
          this.image = e.target.files[0];
        }
      },
      returnLogin() {
        const router = this.$router;
        router.push('/login');
      },
      async handleRegister () {
        const router = this.$router;
        this.loading = true;
        const validate = /\S+@\S+\.\S+/;
        const nickRegex = /[!#$%^&*(),.?":{}|<>]/;
        console.log(nickRegex.test(this.nickname));
        const sameNick = await findNickByName(this.nickname.toLowerCase());
        const vEmail = !this.email || !validate.test(this.email) || this.email === '';
        if (this.firstName.length < 2) {
          window.alert('Necessário preencher um Nome com mais de 2 caracteres');
        } else if (this.lastName.length < 2) {
          window.alert('Necessário preencher um Sobrenome com mais de 2 caracteres');
        } else if (!sameNick) {
          window.alert('O Nick informado já existe');
        } else if (nickRegex.test(this.nickname)) {
          window.alert('o Nick informado possui caracteres que não são permitidos');
        } else if(vEmail) {
          window.alert('Necessário preencher um Email válido');
        } else if(this.image.length === 0 || this.image === '') {
          window.alert('Necessário escolher uma imagem de perfil');
        } else if (!this.password || this.password.length < 6) {
          window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
        } else if (this.password !== this.password2) {
          window.alert('As senhas inseridas não conferem');
        } else {
          const reg = await registerUser(
            this.email.toLowerCase(),
            this.password,
            this.firstName.toLowerCase(),
            this.lastName.toLowerCase(),
            this.nickname.toLowerCase(),
            this.image,
          );
          if (reg) router.push('/');
          this.firstName = '';
          this.lastName = '';
          this.nickname = '',
          this.email = '';
          this.password = '';
          this.password2 = '';
        }
        this.loading = false;
      },
    },
  };
  </script>