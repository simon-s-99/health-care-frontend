import { Button } from "./ui/button";

export default function BookingPopup({
  label,
  isOpen,
  setPopup,
  handleFunction,
}) {
  return (
    <div onClick={() => setPopup(null)} className="h-full w-full absolute flex flex-col place-content-center">
      <dialog
        className=" w-1/4 h-1/4 mx-auto border-2 border-black flex flex-col items-center justify-evenly"
        open={isOpen}
      >
        <h2>{label}</h2>

        <div className="flex flex-row justify-evenly gap-4">
          <Button variant="destructive" onClick={() => setPopup(null)}>
            No
          </Button>
          <Button variant="default" onClick={() => handleFunction()}>
            Yes
          </Button>
        </div>
      </dialog>
    </div>
  );
}
