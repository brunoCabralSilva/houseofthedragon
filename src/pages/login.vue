<template>
  <Navigation />
  <section class="bg-drogon bg-cover break-words bg-dice bg-center h-screen w-full items-center justify-center">
    <div class="break-words flex flex-col items-center justify-center sm:px-6 py-8 mx-auto h-full lg:py-0 bg-black/90">
      <div class="break-words p-1 bg-prot-light w-full rounded-lg shadow dark:border sm:max-w-md dark:border-gray-700 z-50 my-5">
        <div class="break-words rounded-lg shadow dark:border md:mt-0 w-full xl:p-0 dark:border-gray-700 ">
          <div class="break-words p-4 space-y-4 md:space-y-6 sm:p-8">
            <div class="break-words space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" class="break-words block mb-2 text-sm font-medium text-white">Email</label>
                <div class="break-words border-2 border-prot-light rounded">
                  <input 
                    type="email"
                    name="email"
                    id="email"
                    v-model="email"
                    class="break-words bg-black border-none outline-none text-white text-sm rounded block w-full p-2.5 placeholder-gray-400 text-center sm:text-left" placeholder="name@company.com"
                  />
                </div>
              </div>
              <div>
                  <label htmlFor="password" class="break-words block mb-2 text-sm font-medium text-white">Senha</label>
                  <div class="break-words border-2 border-prot-light rounded">
                    <input 
                    type="password"
                    name="password"
                    id="password"
                    v-model="password"
                    @keydown.enter="handleLogin"
                    placeholder="••••••"
                    class="break-words text-center sm:text-left bg-black border-none outline-none text-white text-sm rounded block w-full p-2.5 placeholder-gray-400"
                  />
                  </div>
              </div>
              <div class="break-words flex items-center justify-center sm:justify-end">
                  <button
                    class="break-words text-sm font-medium underline text-white hover:text-golden transition-colors">
                      Esqueceu a Senha?
                  </button>
              </div>
              <button 
                type="button"
                @click="handleLogin"
                id="sendMessage"
                class="break-words bg-black border-2 border-prot-light transition-colors hover:border-golden text-white w-full focus:ring-prot-light font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {{ loading ? 'Verificando...' : 'Entrar' }}
              </button>
              <router-link to="/register"
                class="break-words text-sm font-light text-white flex flex-col sm:flex-row items-center justify-center">
                Não tem uma conta? <span class="cursor-pointer break-words font-medium hover:underline pl-1 underline text-white hover:text-golden transition-colors">Cadastrar</span>
              </router-link>   
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script>
import Footer from '@/components/footer.vue';
import Navigation from '@/components/navigation.vue';
import { useRouter } from "vue-router";
import { authenticate, signIn } from "../firebase/authenticate";

export default {
  name: 'NewsPage',
  data() {
    return {
    email: '',
    password: '',
    loading: false,
    showData: false,
    }
  },
  components: {
    Navigation,
    Footer
  },
  async created() {
    const router = useRouter();
    const auth = await authenticate();
    if (auth) router.push("/");
    else this.showData = true;
  },
  methods: {
    async handleLogin() {
      const router = this.$router;
      this.loading = true;
      const validate = /\S+@\S+\.\S+/;
      const vEmail = !this.email || !validate.test(this.email) || this.email === '';
      if (vEmail) {
        window.alert('Necessário preencher um Email válido');
        this.loading = false;
      } else if (!this.password || this.password.length < 6) {
        window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
        this.loading = false;
      } else {
        const log = await signIn(this.email, this.password);
        if (log) router.push("/");
        else window.alert('Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.');
        this.loading = false;
      }
    },

    handleKeyDown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleLogin();
      }
    },
  }
}
</script>
