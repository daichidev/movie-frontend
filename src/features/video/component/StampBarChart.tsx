import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ReactComponent as Revert } from '../../../assets/svgs/back.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/svgs/close_alt.svg';
import { ReactComponent as DeletePopupIcon } from '../../../assets/svgs/delete_popup.svg';
import { ReactComponent as Star } from '../../../assets/svgs/star.svg';
import styles from './StampBarChart.module.scss';

const gradientNormal = 'gradient_normal';
const gradientGood = 'gradient_good';
const gradientBest = 'gradient_best';
const cellSizeBase = 65;
const cellSizeAdjusted = cellSizeBase - 0.385;
const unitSec = 10;
const starOffset = 82;
const dataPoints = (total: number, unit: number) =>
  Array.from({ length: Math.ceil(total / unit) }).map((_, i) => i);

export const MOCK_STAMP_CHART_DATA: StampBarChartProps['data'] = dataPoints(
  1800, // video totalSec
  unitSec,
).map((i) => {
  return {
    timeSec: i * unitSec,
    normal: Math.floor(Math.random() * 26),
    good: Math.floor(Math.random() * 26),
    best: Math.floor(Math.random() * 26),
  };
});
export const MOCK_MY_STAMPS: StampBarChartProps['myStamps'] = [
  { stamp: 'normal', time: 50 },
  { stamp: 'good', time: 50 },
  { stamp: 'best', time: 50 },
  { stamp: 'normal', time: 10 },
  { stamp: 'normal', time: 420 },
  { stamp: 'good', time: 100 },
  { stamp: 'good', time: 1790 },
  { stamp: 'best', time: 10 },
  { stamp: 'best', time: 1790 },
] as const;

const STAMP_TYPES = ['normal', 'good', 'best'] as const;
export type StampType = (typeof STAMP_TYPES)[number];
export type StampBarChartProps = {
  data: { timeSec: number; normal: number; good: number; best: number }[];
  myStamps: { stamp: StampType; time: number }[];
  showDelete: boolean;
  submitDeleteStamp: (time: number, stamps: StampType[]) => Promise<void>;
};
export const StampBarChart = ({
  data,
  myStamps,
  showDelete,
  submitDeleteStamp,
}: StampBarChartProps) => {
  const [selectedStamps, setSelectedStamps] = useState<{
    time: number;
    stamps: StampType[];
  }>();

  const myStampsGrouped = myStamps.reduce<Record<number, StampType[]>>(
    (acc, cur) => {
      if (!acc[cur.time]) acc[cur.time] = [];
      acc[cur.time].push(cur.stamp);
      return acc;
    },
    {},
  );

  useEffect(() => {
    if (showDelete) return;
    setSelectedStamps(undefined);
  }, [showDelete]);
  return (
    <div className={styles.container}>
      <BarChart data={data} width={data.length * cellSizeBase} height={240}>
        <defs>
          <linearGradient
            id={gradientBest}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#4FD8EB" />
            <stop offset="1" stop-color="#05A0E2" />
          </linearGradient>
          <linearGradient
            id={gradientGood}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBondingBox"
          >
            <stop offset="0" stop-color="#9DDD5D" />
            <stop offset="1" stop-color="#47B934" />
          </linearGradient>
          <linearGradient
            id={gradientNormal}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#F5D942" />
            <stop offset="1" stop-color="#F9A400" />
          </linearGradient>
        </defs>
        <CartesianGrid
          verticalCoordinatesGenerator={(props) => {
            return [
              cellSizeAdjusted,
              ...data.map((_, i) => (i + 2) * cellSizeAdjusted),
            ];
          }}
        />
        <XAxis dataKey="timeSec" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Bar dataKey="normal" fill={`url(#${gradientNormal})`} barSize={10} />
        <Bar dataKey="good" fill={`url(#${gradientGood})`} barSize={10} />
        <Bar dataKey="best" fill={`url(#${gradientBest})`} barSize={10} />
      </BarChart>
      {Object.keys(myStampsGrouped)
        .sort()
        .map((key) => {
          const stamps = myStampsGrouped[key as any];
          return (
            <div
              key={key}
              className={styles['stamp-position']}
              style={{
                left: `${(+key / unitSec) * cellSizeAdjusted + starOffset}px`,
              }}
            >
              <div className={styles.container}>
                {STAMP_TYPES.map(
                  (stampType) =>
                    stamps.includes(stampType) && (
                      <Star
                        key={stampType}
                        className={clsx(styles.stamp, styles[stampType])}
                      />
                    ),
                )}
                {showDelete && (
                  <button
                    className={styles.delete}
                    onClick={() => setSelectedStamps({ time: +key, stamps })}
                  >
                    <DeletePopupIcon />
                  </button>
                )}
                {selectedStamps?.time === +key && (
                  <StampDeletePopup
                    {...selectedStamps}
                    submit={submitDeleteStamp}
                  />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

const StampDeletePopup = ({
  time,
  stamps,
  submit,
}: {
  time: number;
  stamps: StampType[];
  submit: (time: number, stamps: StampType[]) => Promise<void>;
}) => {
  const [deletingStamps, setDeletingStamps] = useState<StampType[]>([]);
  return (
    <div className={styles['delete-popup']}>
      {STAMP_TYPES.map(
        (stampType) =>
          stamps.includes(stampType) && (
            <DeleteToggle
              stampType={stampType}
              deletingStamps={deletingStamps}
              setDeletingStamps={setDeletingStamps}
            />
          ),
      )}
      <button
        className={styles.submit}
        onClick={() => submit(time, deletingStamps)}
      >
        <ruby>
          決<rt>けっ</rt>定<rt>てい</rt>
        </ruby>
      </button>
    </div>
  );
};

const DeleteToggle = ({
  stampType,
  deletingStamps,
  setDeletingStamps,
}: {
  stampType: StampType;
  deletingStamps: StampType[];
  setDeletingStamps: (stamps: StampType[]) => void;
}) => {
  const isDeleting = deletingStamps.includes(stampType);

  return (
    <div className={styles['toggle-container']}>
      <Star
        className={clsx(
          styles.stamp,
          styles[stampType],
          isDeleting && styles.deleting,
        )}
      />
      <button
        onClick={() => {
          isDeleting
            ? setDeletingStamps(
                deletingStamps.filter((stamp) => stamp !== stampType),
              )
            : setDeletingStamps([...deletingStamps, stampType]);
        }}
      >
        {isDeleting ? <Revert /> : <DeleteIcon />}
      </button>
    </div>
  );
};
