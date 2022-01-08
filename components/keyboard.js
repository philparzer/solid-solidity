export default function Keyboard({size, isPBT, filter}) {
  const sizeDir = {
    0: 'sixty-percent',
    1: 'seventy-five-percent',
    2: 'eighty-percent',
    3: 'iso-105',
  }[size]

  const material = isPBT ? 'PBT' : 'ABS'

  const imagePath = `keyboards/${sizeDir}/${material}.png`;
  const alt = `${sizeDir} keyboard with ${material} keys ${filter? `with ${filter}` : ""}`;

  return (
    <div className="rounded-lg p-2 border border-white">
      <img className={"h-[230px] w-[360px] " + filter} src={imagePath} alt={alt} />
    </div>
  )}