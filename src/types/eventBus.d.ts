declare module "@/eventBus" {
    import mitt from "mitt";
    const eventBus: ReturnType<typeof mitt>;
    export { eventBus };
}
