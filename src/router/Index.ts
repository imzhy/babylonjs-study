import {createRouter, createWebHashHistory} from "vue-router";
import {Component} from "vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Index",
            component: (): Component => import("@view/Index")
        },
        {
            path: "/second",
            name: "Second",
            component: (): Component => import("@view/Second.vue")
        },
        {
            path: "/three",
            name: "Three",
            component: (): Component => import("@view/Three.vue")
        }
    ]
});

export default router;