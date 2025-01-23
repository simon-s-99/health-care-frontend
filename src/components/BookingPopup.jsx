import { Button } from "./ui/button";

export default function BookingPopup({label, isOpen, setIsOpen, handleFunction}) {
  return (
    <dialog className="absolute w-1/4 h-1/4 mx-auto border-2 border-black flex flex-col place-content-center" open={isOpen}>
      <h2>{label}</h2>

      <div className="flex flex-row justify-evenly">
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button onClick={() => handleFunction()}>Ok</Button>
      </div>
    </dialog>
  );
}
