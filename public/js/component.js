// on vue components data looks different, it's not an object,
// it's a fn that returns an object
Vue.component("modal", {
    props: ["id"],
    template: "#modal-template",
    data: function() {
        return {
            image: "",
            title: "",
            description: "",
            username: "",
            timestamp: ""
        };
    },
    // we shouldn't change the props
    // the id of each image as a prop
    mounted: function() {
        console.log("my Modal component has mounted!");
        var me = this;
        axios
            .get(`/image-data/${this.id}`)
            .then(function(response) {
                console.log("response from /image-data:", response);
                me.image = response.data[0].url;
                me.title = response.data[0].title;
                me.description = response.data[0].description;
                me.username = response.data[0].username;
                me.timestamp = response.data[0]["created_at"];
            })
            .catch(err =>
                console.log("error in response from image-data: ", err)
            );
    }
    // methods: {
    //     openModal: function(image.id) {
    //         this.$emit("openmodal", {});
    //     }
    // }
});
