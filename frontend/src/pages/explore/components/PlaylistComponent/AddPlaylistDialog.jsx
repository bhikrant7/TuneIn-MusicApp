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
import { axiosInstance } from "@/lib/axios";
import { PlusSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllPlaylist } from "@/store/Slices/usePlaylistSlice";

const AddPlaylistDialog = () => {
  const dispatch = useDispatch();
  const [DialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
  });

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!newPlaylist.title) {
        return toast.error("Please provide a title.");
      }

      const formData = new FormData();
      formData.append("title", newPlaylist.title);

      await axiosInstance.post("albums/playlist/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewPlaylist({
        title: "",
      });
      setDialogOpen(false);
      dispatch(fetchAllPlaylist());
    } catch (error) {
      toast.error("Failed to create Playlist: " + error.message, {
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
    <>
      <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative">
            <div className="aspect-square shadow-lg overflow-hidden rounded-lg bg-zinc-800/5">
              <img src="page/create.jpeg" alt="create playlist"
                className="w-full h-full object-cover transition-transform duration-300 
                            "
              />
              {/* <PlusSquare className="h-full w-full text-zinc-900/60" /> */}
            </div>
            <Button
              variant={"outline"}
              className="w-full min-h-12 object-cover text-zinc-300 bg-gradient-to-b from-swatch-2 via-swatch-2/40 to-swatch-2 hover:bg-swatch-1/70 overflow-hidden"
            >
              Create Playlist
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Create Playlist</DialogTitle>
            <DialogDescription>
              Create Your Own Playlist
              <p className="text-red-400 italic text-xs pt-1">
                Disclaimer*: Setting own playlist profile image is removed to
                save cloud space
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newPlaylist.title}
                onChange={(e) =>
                  setNewPlaylist({ ...newPlaylist, title: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-zinc-700 hover:bg-zinc-800 text-white"
            >
              {isLoading ? "Creating..." : "Create Playlist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddPlaylistDialog;
