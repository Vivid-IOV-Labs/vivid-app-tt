import store from "@/store/index";

export function startLoading(taskName) {
  store.dispatch("uistates/setTaskQueue", {
    name: taskName,
    loading: true
  });
}
export function stopLoading(taskName) {
  store.dispatch("uistates/setTaskQueue", {
    name: taskName,
    loading: false
  });
}
