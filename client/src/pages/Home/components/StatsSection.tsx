
import { useEffect } from "react";
import { useRef } from "react";

const stats = [
  { label: "الأسر المستفيدة", target: 84610 },
  { label: "الأسر المكفولة", target: 594 },
  { label: "الجمعيات المشاركة", target: 201 },
  { label: "الساعات التطوعية", target: 50563 },
  { label: "المتطوعين", target: 2245 },
  { label: "المبادرات المنفذة", target: 104 },
  { label: "مستفيدي البرامج التمويلية", target: 1348 },
];

const StatsSection = () => {
  const counters = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    counters.current.forEach((counter) => {
      counter.innerText = "0";
      let currentTarget = +(counter.dataset.target as string);
      const hand = setInterval(() => {
        +counter.innerHTML < currentTarget
          ? (counter.innerHTML = String(
              Number(counter.innerHTML) + Math.ceil(currentTarget / 400)
            ))
          : (counter.innerHTML = currentTarget.toLocaleString());
        if (+counter.innerHTML == currentTarget) {
          clearInterval(hand);
        }
      }, 12);
    });
  }, []);

  return (
    <section className="md:!mt-22 !mt-12 !mb-10 md:!mb-18">
      {/* <h2 className=" mt-5 my-section-title justify-center  font-bold">إحصائيات   عام 2024</h2> */}

      <h2 className="my-section-title  !text-xl md:!text-3xl !mt-19 !mb-8 text-center mx-auto !flex !justify-center !items-center !w-fit">  إحصائيات عام 2024</h2>
      <div className="stats-container">
        {stats.map(({ label, target }, i) => (
          <div className="stat-box" key={i}>
            <div className="label">{label}</div>
            <div
              className="number"
              ref={(el) => {
                if (el) counters.current[i] = el;
              }}
              data-target={target}
            >
              0
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
