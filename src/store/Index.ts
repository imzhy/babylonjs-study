import {createPinia, defineStore} from "pinia";

const pinia = createPinia();

export default pinia;

export const useIndex = defineStore({
    id: "index",
    state: (): Record<string, any> => {
        return {

        }
    },
    actions: {

    }
})