import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface DialogDemoProps {
  link?: string;
}

export function DialogDemo({ link }: DialogDemoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          View Document
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] h-[80%] flex justify-center items-center">
        {link && (
          <iframe
            src={link}
            width="100%"
            height="100%"
            className="border mt-4"
            title="Document Preview"
          ></iframe>
        )}
      </DialogContent>
    </Dialog>
  );
}
