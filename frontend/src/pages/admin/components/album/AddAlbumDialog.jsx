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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddAlbumDialog = () => {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    releaseYear: new Date().getFullYear(),
    tags: [],
  });

  const [files, setFiles] = useState({
    image: null,
  });

  const [tagInput, setTagInput] = useState("");
  const imageInputRef = useRef(null);

  const handleTagChange = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const tagValue = tagInput.trim();
      if (tagValue && !newAlbum.tags.includes(tagValue)) {
        setNewAlbum((prev) => ({
          ...prev,
          tags: [...prev.tags, tagValue],
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setNewAlbum((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files.image) {
        return toast.error("Please upload image files");
      }

      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear);
      newAlbum.tags.forEach((tag) => {
        formData.append("tags", tag);
      });

      formData.append("imageFile", files.image);

      await axiosInstance.post("/admin/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      //default values
      setNewAlbum({
        title: "",
        artist: "",
        releaseYear:"",
        tags: [],
      });

      setFiles({
        image: null,
      });
      setAlbumDialogOpen(false);
      toast.success("album added successfully🎉", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#341949",
          color: "#66FF00",
        },
      });
    } catch (error) {
      toast.error("Failed to add album: " + error.message, {
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
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-700 hover:bg-purple-900 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Album
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>Add a new album to your library</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            type="file"
            hidden
            accept="image/*"
            ref={imageInputRef}
            onChange={(e) =>
              setFiles((prev) => ({
                ...prev,
                image: e.target.files[0],
              }))
            }
          />
        </div>
        {/* Image upload area */}
        <div
          className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
          onClick={() => imageInputRef.current?.click()}
        >
          <div className="text-center">
            {files.image ? (
              <div className="space-y-2">
                <div className="text-sm text-emerald-500">Image selected:</div>
                <div className="text-xs text-zinc-400">
                  {files.image.name.slice(0, 20)}
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                  <Upload className="h-6 w-6 text-zinc-400" />
                </div>
                <div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
                <Button variant="outline" size="sm" className="text-xs">
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Other fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={newAlbum.title}
            onChange={(e) =>
              setNewAlbum({ ...newAlbum, title: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Artist</label>
          <Input
            value={newAlbum.artist}
            onChange={(e) =>
              setNewAlbum({ ...newAlbum, artist: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Release Year</label>
          <Input
            value={newAlbum.releaseYear}
            placeholder="2025"
            onChange={(e) =>
              setNewAlbum({ ...newAlbum, releaseYear: e.target.value })
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
                  {newAlbum.tags.length > 0
                    ? `${newAlbum.tags.length} tags selected`
                    : "Select Tags"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-max p-4 space-y-2 bg-zinc-800 border-zinc-700">
                <Label className="text-sm font-medium text-white">Tags</Label>

                {/* Display selected tags */}
                <div className="flex gap-2 flex-wrap">
                  {newAlbum.tags.length > 0 ? (
                    newAlbum.tags.map((tag, index) => (
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
                    <span className="text-gray-400 text-sm">No tags added</span>
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setAlbumDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Add Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbumDialog;
