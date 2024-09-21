import { CalendarIcon } from '@radix-ui/react-icons'
import { Button } from './components/ui/button'
import './App.css'
import { Calendar } from './components/ui/calendar'
import { cn } from './lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from './components/ui/popover'
import {  useEffect, useState } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

function App() {
  const [daysDiff, setDaysDiff] = useState([0])
  const totalDays = daysDiff.reduce((acc, curr) => acc + curr, 0)
  const today = dayjs()
  const later = dayjs().add(totalDays, 'days')
  const diffObj = dayjs.duration(later.diff(today))

  return (
    <div className='flex flex-col w-full h-full'>
      <h1 className='mb-12'>Calculador de periodos</h1>
      <div className='flex flex-col gap-4 mb-12'>
        {daysDiff.map((_, i) => (
          <div className='flex gap-12 items-center'>
            {i}
            <Period key={i} onChange={(days) => setDaysDiff([...daysDiff.slice(0,i),days, ...daysDiff.slice(i+1)])} />
            {i == daysDiff.length -1 && i !== 0 && <Button onClick={() => setDaysDiff([...daysDiff.slice(0,i), ...daysDiff.slice(i+1)])}>Eliminar periodo</Button>}
          </div>
        ))}
      </div>
      <Button onClick={() => setDaysDiff([...daysDiff, 0])} className='mb-4'>Agregar periodo</Button>
      <h2>Periodo total trabajado</h2>
      <span>{diffObj.format('Y')} años {diffObj.format('M')} meses {diffObj.format('D')} dias</span>      
    </div>
  )
}

function Period ({ onChange }: { onChange: (diff: number) => void }) {
  const [initial, setInitial] = useState(undefined as unknown as dayjs.Dayjs)
  const [final, setFinal] = useState(undefined as unknown as dayjs.Dayjs)

  useEffect(() => {
    if (initial !== undefined && final !== undefined) {
      onChange(final.diff(initial,'days'))
    }
  }, [initial, final])

  return (
    <div className='flex gap-4 justify-center items-center'>
      <CalendarInput date={initial} setDate={setInitial} placeholder='Fecha inicial' />
      <CalendarInput date={final} setDate={setFinal} placeholder='Fecha final' />

      {final !== undefined && initial !== undefined &&
        <span>{final?.diff(initial,'days')} dias </span>
      }

    </div>
  )
}

function CalendarInput({ date, setDate, placeholder }: {date: dayjs.Dayjs, setDate: (val: any) => void, placeholder: string }) {

  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
            )}
          >
            <span>{date === undefined ? placeholder : date.format('DD/MM/YYYY')}</span>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date?.toDate()}
          onSelect={(newDate) => setDate(dayjs(newDate))}
          fromDate={dayjs().subtract(50, 'year').toDate()}
          toDate={dayjs().add(50, 'year').toDate()}
          captionLayout='dropdown-buttons'
          className='w-[250px]'
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default App
