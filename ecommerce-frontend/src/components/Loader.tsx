export const Loader = ({ text = 'Loading...' }: { text?: string }) => {
  return <div className="loader">{text}</div>;
};
