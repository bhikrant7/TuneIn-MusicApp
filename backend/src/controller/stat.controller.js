import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { PlayHistory } from "../models/playhistory.model.js";
import cron from "node-cron";
import mongoose from "mongoose";

export const getStatData = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Full 7-day range

    const [
      totalSongs,
      totalUsers,
      totalAlbums,
      totalArtistsAgg,
      totalPlaysAgg,
      weeklyPlaysAgg,
      albumsWithTagsAgg,
      dailyPlaysAgg,
      uniqueUsersAgg, // Daily unique users aggregation
    ] = await Promise.all([
      Song.countDocuments(),
      User.countDocuments(),
      Album.countDocuments(),
      Song.aggregate([{ $group: { _id: "$artist" } }, { $count: "count" }]),
      Song.aggregate([
        { $group: { _id: null, total: { $sum: "$playCount" } } },
      ]),
      Song.aggregate([
        { $group: { _id: null, total: { $sum: "$weeklyPlays" } } },
      ]),
      Album.countDocuments({ tags: { $exists: true, $ne: [] } }),
      PlayHistory.aggregate([
        {
          $match: { playedAt: { $gte: sevenDaysAgo } },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$playedAt",
                timezone: "UTC",
              },
            },
            plays: { $sum: 1 },
          },
        },
        { $project: { date: "$_id", plays: 1, _id: 0 } },
        { $sort: { date: 1 } },
      ]),
      PlayHistory.aggregate([
        {
          $match: { playedAt: { $gte: sevenDaysAgo } },
        },
        // Group by date and userId to ensure distinct users per day
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$playedAt",
                  timezone: "UTC",
                },
              },
              user: "$userId",
            },
          },
        },
        // Now group by date and count unique users
        {
          $group: {
            _id: "$_id.date",
            uniqueUsers: { $sum: 1 },
          },
        },
        { $project: { date: "$_id", uniqueUsers: 1, _id: 0 } },
        { $sort: { date: 1 } },
      ]),
    ]);

    // Process daily plays with zero-filled days
    const dailyPlays = processDailyPlays(dailyPlaysAgg, sevenDaysAgo);
    // Process daily unique users with zero-filled days
    const dailyUniqueUsers = processDailyUniqueUsers(
      uniqueUsersAgg,
      sevenDaysAgo
    );

    res.status(200).json({
      totalSongs,
      totalUsers,
      totalAlbums,
      totalArtists: totalArtistsAgg[0]?.count || 0,
      totalPlays: totalPlaysAgg[0]?.total || 0,
      weeklyPlays: weeklyPlaysAgg[0]?.total || 0,
      totalGenres: albumsWithTagsAgg,
      dailyPlays,
      dailyUniqueUsers, // Return the daily unique users array
    });
  } catch (error) {
    next(error);
  }
};

// Helper to fill missing days for plays (already defined)
function processDailyPlays(plays, startDate) {
  const dateMap = new Map();
  // Initialize a 7-day map with zero plays
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    dateMap.set(dateStr, { date: dateStr, plays: 0 });
  }
  // Update with actual play data
  plays.forEach((entry) => {
    if (dateMap.has(entry.date)) {
      dateMap.set(entry.date, entry);
    }
  });
  // Convert map to sorted array
  return Array.from(dateMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

function processDailyUniqueUsers(uniqueUsersData, startDate) {
  const dateMap = new Map();
  // Initialize a 7-day map with zero unique users
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    dateMap.set(dateStr, { date: dateStr, uniqueUsers: 0 });
  }

  // Update with actual unique user data from aggregation
  uniqueUsersData.forEach((entry) => {
    if (dateMap.has(entry.date)) {
      dateMap.set(entry.date, entry);
    }
  });

  // Convert map to sorted array
  return Array.from(dateMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

//user monthly stats

export const getUserMonthlyStats = async (req, res) => {
  try {
    // console.log("REceived get")
    const userId = req.user._id
    // console.log(userId)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Aggregate daily play counts for the last 30 days
    const dailyPlays = await PlayHistory.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId), 
          playedAt: { $gte: thirtyDaysAgo } 
        } 
      },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$playedAt" } }, 
          plays: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top song played by the user
    const topSong = await PlayHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$songId", playCount: { $sum: 1 } } },
      { $sort: { playCount: -1 } },
      { $limit: 1 },
      { 
        $lookup: { 
          from: "songs", 
          localField: "_id", 
          foreignField: "_id", 
          as: "song" 
        } 
      },
      { $unwind: "$song" },
      { $project: { title: "$song.title", artist: "$song.artist", imageUrl: "$song.imageUrl", playCount: 1 } },
    ]);

    // Get top artist based on total plays
    const topArtist = await PlayHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { 
        $lookup: { 
          from: "songs", 
          localField: "songId", 
          foreignField: "_id", 
          as: "song" 
        } 
      },
      { $unwind: "$song" },
      { 
        $group: { 
          _id: "$song.artist",
          playCount: { $sum: 1 }
        } 
      },
      { $sort: { playCount: -1 } },
      { $limit: 1 },
      { $project: { name: "$_id", playCount: 1 } },
    ]);

    res.json({
      dailyPlays,
      topSong: topSong[0] || null,
      topArtist: topArtist[0] || null,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};
//update logic play and log
export const updateStatPlay = async (req, res, next) => {
  const { songId } = req.params;
  const userId = req.user._id; // Assuming authentication middleware sets req.user

  // Define throttle times in milliseconds
  const THROTTLE_TIME_SAME = 60000; // 60 seconds for the same song
  const THROTTLE_TIME_OTHER = 10000; // 10 second for any song

  try {
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if the user has already logged a play for this same song within 60 seconds
    const lastPlaySameSong = await PlayHistory.findOne({ userId, songId }).sort(
      { playedAt: -1 }
    );
    if (
      lastPlaySameSong &&
      Date.now() - lastPlaySameSong.playedAt.getTime() < THROTTLE_TIME_SAME
    ) {
      return res.json({
        success: true,
        message:
          "The same song was played recently (within 60 seconds). Skipping duplicate update.",
      });
    }

    // Check if the user has played any song within the last 1 second
    const lastPlayAnySong = await PlayHistory.findOne({ userId }).sort({
      playedAt: -1,
    });
    if (
      lastPlayAnySong &&
      Date.now() - lastPlayAnySong.playedAt.getTime() < THROTTLE_TIME_OTHER
    ) {
      return res.json({
        success: true,
        message:
          "A song was played immediately before (within 10 second). Skipping update for this song.",
      });
    }

     // Attempt to insert the play history entry first to avoid race conditions
     try {
      await PlayHistory.create({ userId, songId, playedAt: new Date() });
    } catch (error) {
      // Handle duplicate key error (unique index violation)
      if (error.code === 11000) {
        return res.json({
          success: true,
          message: "Play already logged, no duplicate update.",
        });
      }
      throw error;
    }

    // Increment play counts only after successful insertion
    const song = await Song.findByIdAndUpdate(
      songId,
      { $inc: { playCount: 1, weeklyPlays: 1 } },
      { new: true,optimisticConcurrency:true }
    );
    res.json({ success: true, song });
  } catch (error) {
    res.status(500).json({ error: "Failed to update play count" });
    next(error);
  }
};

//favs
export const updateStatFav = async (req, res, next) => {
  const { songId } = req.params;

  try {
    const song = await Song.findByIdAndUpdate(
      songId,
      { $inc: { favs: 1 } },
      { new: true,optimisticConcurrency:true }
    );
    res.json({
      success: true,
      song,
    });
    // console.log(song)
  } catch (error) {
    res.status(500).json({ error: "Failed to update favorites" });
    next(error);
  }
};

//reset weekly data
// Reset weekly play counts every Monday at midnight
cron.schedule("0 0 * * MON", async () => {
  try {
    await Song.updateMany({}, { weeklyPlays: 0 });
    console.log("Weekly play counts and favorites reset.");
  } catch (error) {
    console.error("Error resetting weekly data:", error);
    next(error);
  }
});
