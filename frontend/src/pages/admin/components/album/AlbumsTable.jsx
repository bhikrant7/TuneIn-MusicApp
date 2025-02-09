import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteAlbum } from "@/store/Slices/useMusicSlice";

import { Calendar, Music2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const AlbumsTable = () => {
  const dispatch = useDispatch();
  const { albums, isLoading, error } = useSelector((state) => state.useMusic);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading albums...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-swatch-3/30">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead>Songs</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {albums.map((a) => (
          <TableRow key={a._id} className="hover:bg-swatch-3/30">
            <TableCell>
              <img
                src={a.imageUrl}
                alt={a.title}
                className="size-10 rounded object-cover"
              />
            </TableCell>

            <TableCell className="font-medium">{a.title}</TableCell>
            <TableCell>{a.artist}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Calendar className="h-4 w-4" />
                {a.createdAt.split("T")[0]}
              </span>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Music2 className="size-4"/>
                {a.songs.length}
                {" songs"}
              </span>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                {a.tags.length !== 0?a.tags:"__"}
              </span>
            </TableCell>

            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => {
                    dispatch(deleteAlbum(a._id));
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AlbumsTable;
