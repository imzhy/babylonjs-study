import {createRouter, createWebHashHistory} from "vue-router";
import {Component} from "vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Index",
            component: (): Component => import("@view/Index")
        }
    ]
});

export default router;