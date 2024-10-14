export interface Props {
  title: string;
}

/**
 * @title Test section
 */
export default function Section(props: Props) {
  return (
    <div>
      <h1>Hello {props.title}</h1>
    </div>
  );
}
