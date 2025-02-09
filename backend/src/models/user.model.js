import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        uid: { type: String, required: true, unique: true }, // Firebase UID
        email: { type: String, required: true },
        imageUrl: { 
            type: String, 
            default: 'https://i.pinimg.com/originals/47/30/38/473038bf60343d88ccb4188c0df1c544.jpg' 
        },
        isAdmin: {type:Boolean,default: false},
        recentlyPlayed: [
            {
                songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },  //mongoose.Schema.Types.ObjectId means  it is a reference to another document in the Song model

                playedAt: { type: Date, default: Date.now },
            }
        ],
        //for own songs uploaded by users
        ownSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ownSong' }],
        favSongs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}]   //fav songs of each user 


    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.recentlyPlayed; // Exclude recentlyPlayed from default responses unless explici
                delete ret.ownSongs; 
                return ret;
            },
        },
    }
);

// Middleware to ensure the recentlyPlayed array doesn't grow too large
userSchema.pre('save', function (next) {
    if (this.recentlyPlayed.length > 10) {
        this.recentlyPlayed = this.recentlyPlayed.slice(-10); // Keep only the last 10 entries i.e last 10 played songs

    }
    next();
});

export const User = mongoose.model("User", userSchema);



