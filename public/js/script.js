// Part 1
// For part 1 we want to create the main screen that users see when they arrive at
// the site. They should see a screen with the 6 to 12 most recently uploaded images.
// These should be shown as 'cards' arranged in a grid on larger screens and
// a column on smaller screens.
//
// Each card should show the scaled-down image and its title.
//
// Ultimately we will have to add some mechanism for pagination (either with
// buttons or infinite scroll). This will be difficult to implement while we only
// have three images to show. It will be easier to do after part 2 is completed.

// In your Javascript you will have to create a Vue instance and when it mounts make
// an ajax request to get the data for the images. Once you have it, your HTML
// template should loop through them and render each one.

new Vue({
    el: "#main",
    data: {
        seen: false,
        images: []
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
    }
    // methods: {
    //     // i event moze biti argument kao u jQueryju
    //     myFunction: function(animalClickedOn) {
    //         console.log("myFunction is running...");
    //         console.log("name: ", animalClickedOn);
    //         this.name = animalClickedOn;
    //     }
    // }
});
