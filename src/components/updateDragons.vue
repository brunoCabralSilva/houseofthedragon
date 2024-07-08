<template>
  <div class="w-full h-full bg-black/80 fixed z-20 top-0 left-0 flex items-center justify-center p-4">
    <div class="bg-black w-full h-full flex flex-col items-center">
      <div class="break-words pt-4 sm:pt-3 px-3 w-full flex justify-end top-0 right-0">
        <FontAwesomeIcon
          :icon="['fas', 'circle-xmark']"
          class="break-words text-3xl text-golden cursor-pointer duration-500 transition-colors"
          @click="hideUpdate"
        />
      </div>
      <div :class="['flex', 'flex-col', 'w-full', 'h-full', 'overflow-y-auto', excelData.length > 0 ? 'justify-start items-start' : 'justify-center items-center']">
        <p class="text-xl mb-2 px-4 pt-4">Insira um Documento Excel com os Dragões a serem atualizados</p>
        <div :class="['w-full', 'flex', excelData.length > 0 ? 'items-start justify-start' : 'items-center justify-center']">
          <input
            class="p-4"
            type="file"
            @change="handleFileUpload"
          />
        </div>
        <div v-if="excelData.length" class="w-full">
          <p class="text-xl sm:text-3xl w-full px-5 py-2">
            Dragões que serão atualizados:
          </p>
          <div class="flex flex-col w-full h-full gap-2 p-5">
            <div
              v-for="(item, index) in excelData"
              :key="index"
              class="py-3 border-2 border-golden p-3"
            >
              <p class="text-2xl mb-2">{{ item.Dragão }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div class="grid grid-cols-2 sm:flex gap-1">
                  <p class="w-full sm:w-28">Vitalidade: </p>
                  <input
                    type="text"
                    v-model.number="item.Vitalidade"
                    class="bg-golden text-black text-center w-full sm:w-14"
                  />
                </div>
                <div class="grid grid-cols-2 sm:flex gap-1">
                  <p class="w-full sm:w-28">Velocidade: </p>
                  <input
                    type="text"
                    v-model.number="item.Velocidade"
                    class="bg-golden text-black text-center w-full sm:w-14"
                  />
                </div>
                <div class="grid grid-cols-2 sm:flex gap-1">
                  <p class="w-full sm:w-28">Rebeldia: </p>
                  <input
                    type="text"
                    v-model.number="item.Rebeldia"
                    class="bg-golden text-black text-center w-full sm:w-14"
                  />
                </div>
                <div class="grid grid-cols-2 sm:flex gap-1">
                  <p class="w-full sm:w-28">Dracarys: </p>
                  <input
                    type="text"
                    v-model.number="item.Dracarys"
                    class="bg-golden text-black text-center w-full sm:w-14"
                  />
                </div>
                <div class="grid grid-cols-2 sm:flex gap-1">
                  <p class="w-full sm:w-28">Mordida: </p>
                  <input
                    type="text"
                    v-model.number="item.Mordida"
                    class="bg-golden text-black text-center w-full sm:w-14"
                  />
                </div>
                <div class="grid grid-cols-2 sm:flex gap-1">
                  <p class="w-full sm:w-28">Garras: </p>
                  <input
                    type="text"
                    v-model.number="item.Garras"
                    class="bg-golden text-black text-center w-full sm:w-14"
                  />
                </div>
              </div>
            </div>
            <button
              @click="updateDragons"
              type="button"
              class="w-full p-2 bg-golden text-black font-bold"
            >
              {{ loading ? 'Atualizando...': 'Atualizar todos os Dragões' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { updateListOfDragons } from '@/firebase/dragons';
library.add(faCircleXmark);

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      excelData: [],
      loading: false,
    };
  },
  methods: {
    hideUpdate() {
      this.$emit('update-massive');
    },
    async updateDragons() {
      this.loading = true;
      await updateListOfDragons(this.excelData);
      this.loading = false;
      location.reload();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Converte as linhas do Excel em objetos
          const keys = jsonData[0];
          const rows = jsonData.slice(1);
          this.excelData = rows.map(row => {
            return keys.reduce((acc, key, index) => {
              acc[key] = row[index];
              return acc;
            }, {});
          });
        };
        reader.readAsArrayBuffer(file);
      }
    },
  },
};
</script>

<style scoped>
/* Adicione seu estilo aqui */
</style>
