const express= require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const _= require('lodash');
const mongoose= require("mongoose");
require("dotenv").config();

const uri= process.env.N1_URI;
const app= express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const connectDB= async()=>{
    await mongoose.connect(uri);
};

const homeStartingPoint= ({title:"Home", content:"dolor sit amet consectetur adipisicing elit. Expedita itaque maiores voluptatum sed earum aut beatae necessitatibus, repudiandae, inventore cumque ratione fugit optio molestiae blanditiis ducimus cum quisquam voluptas velit iusto! Quae dolorum delectus doloremque. Beatae eligendi ratione dolores nostrum iure harum error tempore nemo officiis, illo inventore aspernatur non. Quasi molestiae quo aliquid voluptatibus illum eius, reiciendis et perspiciatis, officiis totam animi. Exercitationem, cumque, natus, nostrum vitae officia eius tempore optio fuga consectetur quaerat consequatur ullam ipsam totam repellendus cum veritatis? Nostrum aliquam omnis ea? Molestiae similique quas omnis, totam placeat illo excepturi rerum qui quae, dignissimos, alias enim"});
const aboutContent= ({title:"About", content:"Lorem, ipsum Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error iure mollitia rerum sit adipisci aliquid saepe expedita minima, quaerat sapiente sint quod deserunt iste odio deleniti illo, excepturi voluptate in possimus tenetur beatae pariatur illum dolore distinctio. Adipisci, natus! Aliquam amet blanditiis maiores hic quibusdam natus obcaecati recusandae suscipit eos, quo, excepturi tempora, quia ipsum! Eum vero cumque molestias possimus velit nulla dignissimos quis ipsa aut laboriosam, soluta suscipit. Quis, soluta maiores voluptatem eveniet eius fuga ipsa quos et ducimus pariatur magnam autem repellendus nesciunt eum repellat sit, consectetur sequi recusandae dolorum qui asperiores incidunt laboriosam"});
const contactContent= ({title:"Contact Us", content:"Et ipsa rem laborum. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit, similique saepe inventore pariatur unde corporis dicta quia expedita provident exercitationem mollitia facere vero earum beatae laboriosam eligendi explicabo cupiditate optio?Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto tempore illo quibusdam dolore est provident aliquam. Perspiciatis repudiandae veniam dignissimos eius atque ipsa earum iusto aut ullam dicta fugit, illum quia accusantium ut molestiae eaque aspernatur aperiam culpa officia illo. Vero repellat adipisci qui natus! Impedit sapiente labore voluptatibus modi."});

let defaultData= [homeStartingPoint, aboutContent, contactContent];

const postschema= {
    title: String,
    content: String,
}


const Post= mongoose.model("Post", postschema);


app.get("/", function(req, res){
    Post.find({}).then((foundPost)=>{
        if(foundPost.length==0){
            return Post.insertMany(defaultData);
        }else{
            return foundPost;
        }
    }).then((savedPost)=>{
        res.render("home.ejs", {posts: savedPost}
        );
    }).catch((err)=>console.log(err));
});

app.get("/about", (req, res)=>{
   res.render("about.ejs", {startAbout:aboutContent});
})

app.get("/contact", (req, res)=>{
    res.render("contact.ejs", {startContact:contactContent});
})

app.get("/compose", (req, res)=>{
    res.render("compose.ejs");
})

app.get("/posts/:postId", (req, res)=>{
    const requestedPostId= req.params.postId;

    Post.findOne({_id:requestedPostId}).then((post)=>{
        res.render("post.ejs", {title: post.title, content: post.content});
    })
})

app.post("/compose", (req, res)=>{
    const post= {
        title: req.body.postTitle,
        content: req.body.postBody
    };
    Post.create(post);

    res.redirect("/");
})


connectDB().then(()=>{
    app.listen(3000, ()=>{
        console.log("Server is up and running at 3000...");
    })
})
