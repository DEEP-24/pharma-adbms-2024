// import * as React from 'react'

// import { type Table } from '@tanstack/react-table'
// import {
//   CheckIcon,
//   ChevronDownIcon,
//   DotIcon,
//   FilterXIcon,
//   ListIcon,
// } from 'lucide-react'

// import { type ITableView } from '~/components/data-table/table'
// import { Button } from '~/components/ui/button'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
// } from '~/components/ui/command'
// import { CustomButton } from '~/components/ui/custom-button'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '~/components/ui/popover'
// import { cn } from '~/utils/helpers'

// interface DataTableViewList<TData> {
//   currentView?: ITableView
//   onViewChange: (view?: ITableView) => void
//   table: Table<TData>
//   views: ITableView[]
// }

// export function DataTableViewList<TData>({
//   currentView,
//   onViewChange,
//   table,
//   views,
// }: DataTableViewList<TData>) {
//   const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

//   return (
//     <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
//       <PopoverTrigger asChild>
//         <CustomButton
//           className="w-auto shrink-0 pr-0 text-xsm font-normal text-gray-500"
//           color="gray"
//           leftSection={<ListIcon size={14} />}
//           size="compact-sm"
//           variant="subtle"
//         >
//           <div className="gap flex items-center">
//             <span>{currentView ? currentView.name : 'All'}</span>
//             <DotIcon className="text-gray-400" size={16} />
//             <span className="font-mono text-xsm text-gray-600">
//               {table.getFilteredRowModel().rows.length}
//             </span>
//           </div>

//           <ChevronDownIcon className="ml-2 text-gray-400" size={14} />
//         </CustomButton>
//       </PopoverTrigger>

//       <PopoverContent align="start" className="w-[200px] p-0">
//         <Command>
//           <CommandInput className="h-8" placeholder="Search" />
//           <CommandList>
//             <CommandEmpty>No results found.</CommandEmpty>

//             <CommandGroup>
//               <CommandItem
//                 className="py-1"
//                 onSelect={() => {
//                   onViewChange(undefined)
//                   setIsPopoverOpen(false)
//                 }}
//               >
//                 <div
//                   className={cn('mr-2.5 flex h-3 items-center justify-center')}
//                 >
//                   <CheckIcon
//                     className={cn(currentView ? 'invisible' : '')}
//                     size={14}
//                   />
//                 </div>
//                 <span>All</span>
//               </CommandItem>

//               {views.map(view => {
//                 const isSelected = currentView?.id === view.id

//                 return (
//                   <CommandItem
//                     className="py-1"
//                     key={view.id}
//                     onSelect={() => {
//                       onViewChange(view)
//                       setIsPopoverOpen(false)
//                     }}
//                   >
//                     <div
//                       className={cn(
//                         'mr-2.5 flex h-3 items-center justify-center',
//                       )}
//                     >
//                       <CheckIcon
//                         className={cn(isSelected ? '' : 'invisible')}
//                         size={14}
//                       />
//                     </div>
//                     <span>{view.name}</span>
//                   </CommandItem>
//                 )
//               })}
//             </CommandGroup>

//             <CommandSeparator />
//             <CommandGroup>
//               <CommandItem
//                 disabled={!currentView}
//                 onSelect={() => {
//                   onViewChange(undefined)
//                   setIsPopoverOpen(false)
//                 }}
//               >
//                 <Button
//                   className="flex items-center gap-2.5"
//                   disabled={!currentView}
//                   variant="unstyled"
//                 >
//                   <FilterXIcon size={12} />
//                   Reset
//                 </Button>
//               </CommandItem>
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   )
// }
