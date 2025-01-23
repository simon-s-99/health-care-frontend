import { Button } from "./ui/button";

export default function BookingPopup({label, isOpen, setPopup, handleFunction}) {
  return (
    <dialog className="absolute w-1/4 h-1/4 mx-auto border-2 border-black flex flex-col items-center justify-evenly" open={isOpen}>
      <h2>{label}</h2>

      <div className="flex flex-row justify-evenly gap-4">
        <Button variant="destructive" onClick={() => setPopup(null)}>Cancel</Button>
        <Button variant="default" onClick={() => handleFunction()}>Ok</Button>
      </div>
    </dialog>
  );
}
