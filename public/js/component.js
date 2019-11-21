// ******************** VUE COMPONENT ***************************
Vue.component("modal", {
    props: ["id"],
    template: "#modal-template",
    data: function() {
        return {
            image: "",
            title: "",
            description: "",
            username: "",
            timestamp: "",
            comments: [],
            comment: {
                name: "",
                text: ""
            }
        };
    },
    // we shouldn't change the props
    // the id of each image as a prop
    watch: {
        id: function() {
            var me = this;
            axios.get(`/image-data/${me.id}`).then(function(response) {
                if (response.data.length > 0) {
                    me.image = response.data[0].url;
                } else {
                    function closeModal() {
                        me.$emit("close-the-modal");
                    }
                    closeModal();
                }
            });
        }
    },
    mounted: function() {
        console.log("my Modal component has mounted!");
        var me = this;
        axios
            .get(`/image-data/${me.id}`)
            .then(function(response) {
                console.log("response from /image-data:", response);
                me.image = response.data[0].url;
                me.title = response.data[0].title;
                me.description = response.data[0].description;
                me.username = response.data[0].username;
                me.timestamp = response.data[0]["created_at"];
            })
            .then(function() {
                axios
                    .get(`/image-data/${me.id}/comments`)
                    .then(function(response) {
                        console.log(
                            "results in image data comments: ",
                            response.data
                        );
                        if (response.data.length > 0) {
                            for (let i = 0; i < response.data.length; i++) {
                                me.comments.unshift(response.data[i]);
                            }
                        }
                    });
            })
            .catch(err =>
                console.log("error in response post image-data/comments: ", err)
            );
    },
    methods: {
        addImageComment: function(e) {
            e.preventDefault();
            var me = this;
            var submittedComm = {
                name: me.comment.name,
                text: me.comment.text
            };
            axios
                .post(`/comment/${me.id}/add`, submittedComm)
                .then(function(response) {
                    console.log("response in image data ", response.data);
                    me.comments.unshift(response.data[0]);
                    me.comment.text = "";
                    me.comment.name = "";
                })
                .catch(err =>
                    console.log("error in axios post of addImageComment: ", err)
                );
        },
        closeModal: function() {
            // name of the emitted message (close-the-modal) is refering to the eventhandler in the <modal> tag in index.html
            this.$emit("close-the-modal");
        }
    }
});
