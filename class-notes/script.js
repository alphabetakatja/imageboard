console.log("sanity check!");

// method
new Vue({
    el: "#main",
    data: {
        //things that change on the page
        name: "Habanero!",
        seen: false,
        animals: []
    },
    mounted: function() {
        console.log("my Vue components has mounted!");
        console.log("this is my animals data: ", this.animals);
        var me = this;
        axios
            .get("/animals")
            .then(function(response) {
                console.log("response from /animals: ", response.data);
                console.log("this.animals: ", me.animals);
                me.animals = response.data;
            })
            .catch(err => console.log("error in response from animals: ", err));
    },
    methods: {
        // i event moze biti argument kao u jQueryju
        myFunction: function(animalClickedOn) {
            console.log("myFunction is running...");
            console.log("name: ", animalClickedOn);
            this.name = animalClickedOn;
        }
    }
});

// vue can do loops...
// and we can run our own methods
