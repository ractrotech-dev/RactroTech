export function LockerRow({ values }: { values: number[] }) {
  return (
    <ol className="lockers" aria-label="An array of five boxes">
      {values.map((value, index) => (
        <li className="locker" key={index}>
          <span className="locker-i">index {index}</span>
          <strong className="locker-v">{value}</strong>
        </li>
      ))}
    </ol>
  );
}
