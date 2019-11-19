new Vue({
    el: "#main",
    data: {
        seen: false,
        images: [],
        title: "",
        description: "",
        username: "",
        file: null
    },
    mounted: function() {
        console.log("my Vue components has mounted!");
        console.log("this is my images data: ", this.images);
        var me = this;
        axios
            .get("/images")
            .then(function(response) {
                console.log("response from /images: ", response.data);
                console.log("this.images: ", me.images);
                me.images = response.data;
            })
            .catch(err => console.log("error in response from images: ", err));
    },
    methods: {
        handleClick: function(e) {
            e.preventDefault();
            console.log("this: ", this);
            var me = this;
            // this.title, this.description, this.username
            var fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            axios
                .post("/upload", fd)
                .then(function(response) {
                    console.log("response from post upload ", response.data);
                    me.images.unshift(response.data.image);
                })
                .catch(function(err) {
                    console.log("error in post upload: ", err);
                });
        },
        handleChange: function(e) {
            //listening for a change on this input field
            console.log("handleChange is happening!");
            // it's an arraylike object and the file lives only in the first item of this object
            console.log("e.target.files[0]", e.target.files[0]);
            this.file = e.target.files[0];
        }
    }
});
