// ******************** VUE INSTANCE ***************************
new Vue({
    el: "#main",
    data: {
        seen: false,
        currentImage: location.hash.slice(1) || null,
        // location.hash.slice(1);
        // the hash is available to us in js
        // location.hash - always a string, either empty or #
        // window.addEventListener('hashchange', function() {
        //     console.log(location.hash.slice(1));
        // })
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        more: true,
        print: false
    },
    mounted: function() {
        console.log("my Vue components has mounted!");
        console.log("this is my images data: ", this.images);
        var me = this;
        window.addEventListener("hashchange", function() {
            me.currentImage = location.hash.slice(1);
        });

        axios
            .get("/images")
            .then(function(response) {
                console.log("response from /images: ", response.data);
                console.log("this.images: ", me.images);
                me.images = response.data;
            })
            .catch(err => console.log("error in response from images: ", err));

        // addEventListener("hashchange", function() {
        //     console.log(location.hash.slice(1));
        // });
    },
    methods: {
        handleClick: function(e) {
            e.preventDefault();
            console.log("this: ", this);
            var me = this;
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
        },
        setCurrentImage: function(id) {
            this.currentImage = id;
        },
        closingTheModal: function() {
            this.currentImage = null;
        },
        showMore: function() {
            var me = this;
            let lastId = me.images[me.images.length - 1].id;
            // let firstId = me.images[10].id;
            axios.get(`/more/${lastId}`).then(function(response) {
                console.log("Response in show more images: ", response.data);
                me.images = me.images.concat(response.data);
                if (response.data == 0) {
                    me.more = false;
                    me.print = true;
                }
            });
        }
    }
});
