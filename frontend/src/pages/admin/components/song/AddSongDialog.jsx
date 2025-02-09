import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddSongDialog = () => {
  const { albums } = useSelector((state) => state.useMusic);
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    tags: [],
    duration: "0",
  });

  const [files, setFiles] = useState({
    audio: null,
    image: null,
  });

  const [tagInput, setTagInput] = useState("");
  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleTagChange = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const tagValue = tagInput.trim();
      if (tagValue && !newSong.tags.includes(tagValue)) {
        setNewSong((prev) => ({
          ...prev,
          tags: [...prev.tags, tagValue],
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setNewSong((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files.audio || !files.image) {
        return toast.error("Please upload both audio and image files");
      }

      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration);
      newSong.tags.forEach((tag) => {
        formData.append("tag", tag);
      });

      if (newSong.album && newSong.album !== "none") {
        formData.append("albumId", newSong.album);
      }

      formData.append("audioFile", files.audio);
      formData.append("imageFile", files.image);

      await axiosInstance.post("/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewSong({
        title: "",
        artist: "",
        album: "",
        tags: [],
        duration: "0",
      });

      setFiles({
        audio: null,
        image: null,
      });
      setSongDialogOpen(false);
      toast.success("Song added successfully🎉", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#341949",
          color: "#66FF00",
        },
      });
    } catch (error) {
      toast.error("Failed to add song: " + error.message, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#341949",
          color: "#FF0000",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
          <Plus className="mr-2 h-4 w-4" />
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            type="file"
            accept="audio/*"
            ref={audioInputRef}
            hidden
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, audio: e.target.files[0] }))
            }
          />

          <input
            type="file"
            ref={imageInputRef}
            hidden
            accept="image/*"
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />

          {/* Image upload area */}
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="text-center">
              {files.image ? (
                <div className="space-y-2">
                  <div className="text-sm text-emerald-500">
                    Image selected:
                  </div>
                  <div className="text-xs text-zinc-400">
                    {files.image.name.slice(0, 20)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                    <Upload className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">
                    Upload artwork
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Audio upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => audioInputRef.current?.click()}
                className="w-full"
              >
                {files.audio
                  ? files.audio.name.slice(0, 20)
                  : "Choose Audio File"}
              </Button>
            </div>
          </div>

          {/* Other fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newSong.title}
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newSong.artist}
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (seconds)</label>
            <Input
              type="number"
              min="0"
              value={newSong.duration}
              onChange={(e) =>
                setNewSong({ ...newSong, duration: e.target.value || "0" })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[100%]">
                    {newSong.tags.length > 0
                      ? `${newSong.tags.length} tags selected`
                      : "Select Tags"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-max p-4 space-y-2 bg-zinc-800 border-zinc-700">
                  <Label className="text-sm font-medium text-white">Tags</Label>

                  {/* Display selected tags */}
                  <div className="flex gap-2 flex-wrap">
                    {newSong.tags.length > 0 ? (
                      newSong.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-950 p-2 rounded"
                        >
                          <span className="text-sm text-white">{tag}</span>
                          <X
                            className="ml-2 h-4 w-4 cursor-pointer text-white hover:text-red-500"
                            onClick={() => removeTag(tag)}
                          />
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No tags added
                      </span>
                    )}
                  </div>

                  {/* Input for new tags */}
                  <Input
                    placeholder="Add a tag and press enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagChange}
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Album (Optional)</label>
            <Select
              value={newSong.album}
              onValueChange={(value) =>
                setNewSong({ ...newSong, album: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select album" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">No Album (Single)</SelectItem>
                {albums
                  //   .filter((a) => !genreAlbums.some((ag) => ag._id === a._id))
                  .map((album) => (
                    <SelectItem key={album._id} value={album._id}>
                      {album.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSongDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Add Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;
