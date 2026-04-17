export const useRadio = (name: string) => {
  return {
    Radio: ({ id }: { id: string }) => (
      <input name={name} id={id} type="radio" class="hidden peer" />
    ),
  };
};
