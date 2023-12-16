import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ReactComponent as Revert } from '../../../assets/svgs/back.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/svgs/close_alt.svg';
import { ReactComponent as DeletePopupIcon } from '../../../assets/svgs/delete_popup.svg';
import { ReactComponent as Star } from '../../../assets/svgs/star.svg';
import {
  PrimaryButton,
  buttonStyles,
} from '../../../components/Elements/Button';
import { formatDuration } from '../../../utils/duration';
import styles from './StampBarChart.module.scss';

const gradientNormal = 'gradient_normal';
const gradientGood = 'gradient_good';
const gradientBest = 'gradient_best';
const cellSizeBase = 65;
const cellSizeAdjusted = cellSizeBase - 0.385;
const unitSec = 10;
const starOffset = 82;
const dataPoints = (total: number, unit: number) =>
  Array.from({ length: Math.ceil(total / unit) + 1 }).map((_, i) => i);

const MOCK_VIDEO_TOTAL_SEC = 1800;
export const MOCK_STAMP_CHART_DATA: StampBarChartProps['data'] = dataPoints(
  MOCK_VIDEO_TOTAL_SEC,
  unitSec,
).map((i) => {
  return {
    timeSec: Math.min(i * unitSec, MOCK_VIDEO_TOTAL_SEC),
    normal: Math.floor(Math.random() * 26),
    good: Math.floor(Math.random() * 26),
    best: Math.floor(Math.random() * 26),
  };
});
export const MOCK_MY_STAMPS: StampBarChartProps['myStamps'] = [
  { type: 'normal', at: 1 },
  { type: 'good', at: 52 },
  { type: 'best', at: 55 },
  { type: 'normal', at: 10 },
  { type: 'normal', at: 420 },
  { type: 'good', at: 100 },
  { type: 'good', at: 1791 },
  { type: 'best', at: 10 },
  { type: 'best', at: 1802 },
] as const;

const STAMP_TYPES = ['normal', 'good', 'best'] as const;
export type StampType = (typeof STAMP_TYPES)[number];
export type Stamp = { type: StampType; at: number };
export type StampBarChartProps = {
  data: { timeSec: number; normal: number; good: number; best: number }[];
  myStamps: Stamp[];
  showDelete: boolean;
  submitDeleteStamp: (stamps: Stamp[]) => Promise<void>;
};
export const StampBarChart = ({
  data,
  myStamps,
  showDelete,
  submitDeleteStamp,
}: StampBarChartProps) => {
  const [selectedStamps, setSelectedStamps] = useState<{
    time: number;
    stamps: Stamp[];
  }>();

  const myStampsGrouped = myStamps.reduce<Record<number, Stamp[]>>(
    (acc, cur) => {
      const tick = Math.floor(cur.at / unitSec) * unitSec;
      if (!acc[tick]) acc[tick] = [];
      acc[tick].push(cur);
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
        <XAxis
          dataKey="timeSec"
          tickLine={false}
          axisLine={false}
          tickFormatter={formatDuration}
        />
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
                {STAMP_TYPES.map((stampType) => {
                  const stamp = stamps.find(({ type }) => type === stampType);
                  if (!stamp) return null;
                  return (
                    <Star
                      key={stampType}
                      className={clsx(styles.stamp, styles[stampType])}
                    />
                  );
                })}
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
                    stamps={selectedStamps.stamps}
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
  stamps,
  submit,
}: {
  stamps: Stamp[];
  submit: (stamps: Stamp[]) => Promise<void>;
}) => {
  const [deletingStamps, setDeletingStamps] = useState<StampType[]>([]);
  return (
    <div className={styles['delete-popup']}>
      {STAMP_TYPES.map((stampType) => {
        const stamp = stamps.find(({ type }) => type === stampType);
        if (!stamp) return null;
        return (
          <DeleteToggle
            stamp={stamp}
            deletingStamps={deletingStamps}
            setDeletingStamps={setDeletingStamps}
          />
        );
      })}
      <PrimaryButton
        className={styles.submit}
        onClick={() =>
          submit(stamps.filter(({ type }) => deletingStamps.includes(type)))
        }
      >
        <ruby>
          決<rt>けっ</rt>定<rt>てい</rt>
        </ruby>
      </PrimaryButton>
    </div>
  );
};

const DeleteToggle = ({
  stamp,
  deletingStamps,
  setDeletingStamps,
}: {
  stamp: Stamp;
  deletingStamps: StampType[];
  setDeletingStamps: (stamps: StampType[]) => void;
}) => {
  const isDeleting = deletingStamps.includes(stamp.type);

  return (
    <div className={styles['toggle-container']}>
      <Star
        className={clsx(
          styles.stamp,
          styles[stamp.type],
          isDeleting && styles.deleting,
        )}
      />
      <button
        className={buttonStyles['secondary-icon']}
        onClick={() => {
          isDeleting
            ? setDeletingStamps(deletingStamps.filter((e) => e !== stamp.type))
            : setDeletingStamps([...deletingStamps, stamp.type]);
        }}
      >
        {isDeleting ? <Revert /> : <DeleteIcon />}
      </button>
    </div>
  );
};
