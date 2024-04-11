// import * as React from 'react'

// import { Group, Radio, Textarea } from '@mantine/core'
// import { useNavigate } from '@remix-run/react'
// import { CONDITIONS } from '~/data/conditions'
// import { $path } from 'remix-routes'
// import { toast } from 'sonner'
// import { type z } from 'zod'

// import { FourOhFour } from '~/components/404'
// import { GeneralErrorBoundary } from '~/components/GeneralErrorBoundary'
// import { CollapsibleList } from '~/components/collapsible-list'
// import { ConfirmationPopover } from '~/components/confirmation-popover'
// import { useNavigationBlocker } from '~/components/global-blocker-modal'
// import { SubSection } from '~/components/section'
// import { SectionFooter } from '~/components/section-footer'
// import { CustomButton } from '~/components/ui/custom-button'
// import appConfig from '~/config/app.config'
// import { useAppointmentData } from '~/routes/admin+/patients+/$patientId+/$appointmentId+/_layout'
// import { usePatientData } from '~/routes/doctor+/patients+/_layout'
// import {
//   type ActionData as GenerateQuestionActionData,
//   type questionSchema,
// } from '~/routes/resources+/generate-questions'
// import { cn } from '~/utils/helpers'
// import { useFetcherCallback } from '~/utils/hooks/use-fetcher-callback'
// import { PurposeOfVisit } from '~/utils/prisma-enums'

// const Stage = {
//   ANSWERS: 'answers',
//   GENERATE_QUESTION: 'generate-question',
// } as const

// type Stage = (typeof Stage)[keyof typeof Stage]
// type GeneratedQuestion = z.infer<typeof questionSchema>

// export default function Labs() {
//   const { patient } = usePatientData()
//   const { appointment } = useAppointmentData()

//   const [questions, setQuestions] = React.useState<GeneratedQuestion[]>([])
//   const [currentStage, setCurrentStage] = React.useState<Stage>(
//     Stage.GENERATE_QUESTION,
//   )

//   const navigate = useNavigate()
//   React.useEffect(() => {
//     const isInvalidAppointment =
//       appointment.purpose !== PurposeOfVisit.CONSULTATION

//     if (isInvalidAppointment) {
//       navigate(
//         $path('/admin/patients/:patientId/:appointmentId/overview', {
//           patientId: appointment.patientId,
//           appointmentId: appointment.id,
//         }),
//       )
//     }
//   }, [appointment.id, appointment.patientId, appointment.purpose, navigate])

//   const saveQuestionsFetcher = useFetcherCallback<GenerateQuestionActionData>()
//   const questionsFetcher = useFetcherCallback<GenerateQuestionActionData>({
//     onSuccess: data => {
//       if (data.questions && data.questions.length > 0) {
//         setQuestions(data.questions)
//         setCurrentStage(Stage.ANSWERS)
//       }
//     },
//   })

//   const [answerState, setAnswerState] = React.useState<string[]>(
//     Array(questions?.length).fill(''),
//   )

//   const handleRadioChange = (id: number, value: string) => {
//     const updatedAnswers = [...answerState]
//     updatedAnswers[id] = value
//     setAnswerState(updatedAnswers)
//   }

//   useNavigationBlocker({
//     condition: saveQuestionsFetcher.isPending || questionsFetcher.isPending,
//   })

//   return (
//     <>
//       <SubSection className="flex flex-col gap-4 p-5 pt-6">
//         <div className="flex items-center justify-center">
//           {currentStage === Stage.GENERATE_QUESTION ? (
//             <div className="flex w-full flex-col">
//               <questionsFetcher.Form
//                 action={$path('/resources/generate-questions')}
//                 className="flex flex-col gap-4"
//                 id="generate-questions"
//                 method="POST"
//               >
//                 <input defaultValue={patient.gender} hidden name="gender" />
//                 <input defaultValue={patient.id} hidden name="patientId" />
//                 <input
//                   defaultValue={patient.dob.toLocaleString()}
//                   hidden
//                   name="dob"
//                 />

//                 <div className="grid grid-cols-2 gap-4">
//                   <Textarea
//                     autosize
//                     defaultValue={appointment.conditions
//                       .map(c => CONDITIONS[c as keyof typeof CONDITIONS])
//                       .join(', ')}
//                     label="Chief Complaints"
//                     maxRows={8}
//                     minRows={8}
//                     name="chiefComplaint"
//                     placeholder="Enter chief complaints"
//                     required
//                   />

//                   <Textarea
//                     autosize
//                     defaultValue={patient.pastHistory ?? ''}
//                     label="Past History"
//                     maxRows={8}
//                     minRows={8}
//                     name="pastHistory"
//                     placeholder="Enter past history"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <Textarea
//                     autosize
//                     defaultValue={patient.personalHistory ?? ''}
//                     label="Personal History"
//                     maxRows={8}
//                     minRows={8}
//                     name="personalHistory"
//                     placeholder="Enter personal history"
//                   />

//                   <Textarea
//                     autosize
//                     defaultValue={patient.familyHistory ?? ''}
//                     label="Family History"
//                     maxRows={8}
//                     minRows={8}
//                     name="familyHistory"
//                     placeholder="Enter family history"
//                   />
//                 </div>
//               </questionsFetcher.Form>
//             </div>
//           ) : null}

//           {currentStage === Stage.ANSWERS ? (
//             <div className="flex w-full flex-col gap-6">
//               {questions.length > 0 ? (
//                 <div className="flex flex-col gap-6">
//                   {questions.slice(0, appConfig.maxQuestions).map((q, id) => (
//                     <CollapsibleList
//                       className={({ isOpen }) =>
//                         cn(
//                           'rounded-md ring-2 ring-gray-200',
//                           isOpen ? 'bg-white ring-blue-300' : 'bg-gray-50',
//                         )
//                       }
//                       classNames={{
//                         trigger: 'text-sm py-2',
//                         container: 'px-2',
//                       }}
//                       defaultExpanded
//                       key={id}
//                       title={q.question}
//                     >
//                       <div className="flex flex-col gap-4 rounded border bg-gray-50 px-3 pb-4 pt-2">
//                         <Radio.Group
//                           key={id}
//                           name={`question${id}`}
//                           onChange={val => handleRadioChange(id, val)}
//                           required
//                           value={answerState[id] || ''}
//                         >
//                           <Group mt="xs">
//                             {q.options.map((option, idx) => (
//                               <Radio key={idx} label={option} value={option} />
//                             ))}
//                           </Group>
//                         </Radio.Group>
//                       </div>
//                     </CollapsibleList>
//                   ))}
//                 </div>
//               ) : null}
//             </div>
//           ) : null}
//         </div>
//       </SubSection>

//       <SectionFooter sticky>
//         <div className="flex items-center justify-end gap-4">
//           {currentStage === Stage.ANSWERS ? (
//             <>
//               <ConfirmationPopover
//                 onConfirm={() => setCurrentStage(Stage.GENERATE_QUESTION)}
//               >
//                 <CustomButton
//                   className="font-normal"
//                   color="red"
//                   disabled={questionsFetcher.isPending}
//                   size="compact-sm"
//                   variant="light"
//                 >
//                   Regenerate
//                 </CustomButton>
//               </ConfirmationPopover>

//               <CustomButton
//                 className="font-normal"
//                 loading={saveQuestionsFetcher.isPending}
//                 onClick={() => {
//                   const answeredQuestions = questions
//                     .map((q, idx) => ({
//                       answer: answerState[idx],
//                       question: q.question,
//                     }))
//                     .filter(q => q.answer)

//                   if (answeredQuestions.length === 0) {
//                     toast.error(
//                       'Please answer at least one question to generate report.',
//                     )
//                     return
//                   }

//                   saveQuestionsFetcher.submit(
//                     {
//                       data: JSON.stringify(answeredQuestions),
//                       appointmentId: appointment.id,
//                       patientId: patient.id,
//                     },
//                     {
//                       navigate: false,
//                       method: 'POST',
//                       action: $path('/resources/generate-notes'),
//                     },
//                   )
//                 }}
//                 size="compact-sm"
//                 variant="filled"
//               >
//                 Generate Report
//               </CustomButton>
//             </>
//           ) : (
//             <CustomButton
//               className="font-normal"
//               color="dark"
//               form="generate-questions"
//               loading={questionsFetcher.isPending}
//               size="compact-sm"
//               type="submit"
//               variant="filled"
//             >
//               Generate Questions
//             </CustomButton>
//           )}
//         </div>
//       </SectionFooter>
//     </>
//   )
// }

// export function ErrorBoundary() {
//   return (
//     <>
//       <GeneralErrorBoundary
//         className="flex flex-1 items-center justify-center p-2"
//         statusHandlers={{
//           403: error => (
//             <div>
//               <h1>Forbidden</h1>
//               <div className="my-4" />
//               <pre>
//                 <code className="whitespace-pre text-xs">
//                   {JSON.stringify(error, null, 2)}
//                 </code>
//               </pre>
//             </div>
//           ),
//           404: () => <FourOhFour />,
//         }}
//       />
//     </>
//   )
// }
