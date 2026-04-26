export interface TaskData {
  id: string
  label: string
  tooltip: string
}

export interface StageData {
  id: number
  name: string
  tasks: TaskData[]
}

export const STAGES: StageData[] = [
  {
    id: 1,
    name: 'Idea',
    tasks: [
      { id: '1-1', label: 'Topic chosen', tooltip: 'Pick a specific topic. Broad topics get lost. Narrow topics get found.' },
      { id: '1-2', label: 'Unique angle defined', tooltip: 'Why your take? What do you say that the top 3 videos on this topic don\'t?' },
      { id: '1-3', label: 'Search intent identified', tooltip: 'What would your viewer type into YouTube to find this? Write that phrase down.' },
    ],
  },
  {
    id: 2,
    name: 'Research',
    tasks: [
      { id: '2-1', label: '3+ competitor videos watched', tooltip: 'Watch what\'s already ranking. Note what they miss or do badly.' },
      { id: '2-2', label: 'Key talking points listed', tooltip: 'Write 5-7 points you want to make. You won\'t use all of them. That\'s fine.' },
      { id: '2-3', label: 'Gaps in existing content noted', tooltip: 'What question do all existing videos fail to answer? That\'s your edge.' },
    ],
  },
  {
    id: 3,
    name: 'Script / Outline',
    tasks: [
      { id: '3-1', label: 'Hook written (first 30 sec)', tooltip: 'The first 30 seconds determine 70% of watch time. Write it last, polish it most.' },
      { id: '3-2', label: '3 key talking points structured', tooltip: 'Three is the magic number. More than three and viewers tune out.' },
      { id: '3-3', label: 'CTA decided and written', tooltip: 'One CTA only. Subscribe, comment, or watch next — pick one.' },
      { id: '3-4', label: 'Outro scripted', tooltip: 'The outro sets up your next video. Tease it specifically, not generically.' },
    ],
  },
  {
    id: 4,
    name: 'Filming',
    tasks: [
      { id: '4-1', label: 'B-roll shot list made', tooltip: 'List every visual you\'ll need to cut away to. Film these before A-roll if possible.' },
      { id: '4-2', label: 'A-roll footage recorded', tooltip: 'Your main talking head or primary content footage.' },
      { id: '4-3', label: 'B-roll footage recorded', tooltip: 'Supporting visuals that illustrate your talking points.' },
    ],
  },
  {
    id: 5,
    name: 'Editing',
    tasks: [
      { id: '5-1', label: 'Rough cut done', tooltip: 'Lay everything in order. Don\'t polish yet — just get it in sequence.' },
      { id: '5-2', label: 'Captions added', tooltip: 'Auto-captions are a start. Clean them up. 80% of viewers watch with sound off some of the time.' },
      { id: '5-3', label: 'Intro / outro included', tooltip: 'Keep the intro under 5 seconds. Nobody wants a logo animation.' },
      { id: '5-4', label: 'Music / SFX added', tooltip: 'Background music at -20dB or lower. It should be felt, not heard.' },
      { id: '5-5', label: 'Final review watched', tooltip: 'Watch the whole thing once at 1.25x speed as if you\'re the viewer. Fix what feels slow.' },
    ],
  },
  {
    id: 6,
    name: 'Thumbnail',
    tasks: [
      { id: '6-1', label: 'Thumbnail concept chosen', tooltip: 'Big face + bold text + one clear emotion. That\'s the formula. Test a variant.' },
      { id: '6-2', label: 'Thumbnail designed', tooltip: 'Use Canva, Photoshop, or Figma. Squint at it — if you can\'t read it squinting, redo it.' },
      { id: '6-3', label: 'Saved as 1280×720 JPG/PNG', tooltip: 'YouTube requires this exact size. Under 2MB. JPG compresses better than PNG for photos.' },
    ],
  },
  {
    id: 7,
    name: 'SEO',
    tasks: [
      { id: '7-1', label: 'Title finalized (under 60 chars)', tooltip: 'Front-load the keyword. Put the emotional hook after. Keep it under 60 chars or it truncates.' },
      { id: '7-2', label: 'Description written (first 2 lines hook)', tooltip: 'The first 2 lines show before "Show more". Make them count — restate the value, include the keyword.' },
      { id: '7-3', label: 'Tags added (10-15)', tooltip: 'Start with your exact title keyword. Add 3-4 broad variations. Add 2-3 competitor channel names.' },
      { id: '7-4', label: 'Cards and end screens added', tooltip: 'Cards mid-video to related content. End screen at the last 20 seconds — link your best video.' },
    ],
  },
  {
    id: 8,
    name: 'Upload',
    tasks: [
      { id: '8-1', label: 'Video file uploaded', tooltip: 'Upload as unlisted first. Let YouTube process it fully before publishing.' },
      { id: '8-2', label: 'Thumbnail uploaded', tooltip: 'Do this before publishing. A video with no custom thumbnail loses clicks immediately.' },
      { id: '8-3', label: 'All metadata filled', tooltip: 'Title, description, tags, category, language, recording date. Fill every field.' },
      { id: '8-4', label: 'Scheduled or published', tooltip: 'Consistency beats timing. Pick a day and stick to it every week.' },
    ],
  },
  {
    id: 9,
    name: 'Post-publish',
    tasks: [
      { id: '9-1', label: 'Pinned comment added', tooltip: 'Pin a comment that adds value — a key resource, a question for viewers, or a link.' },
      { id: '9-2', label: 'Community post made', tooltip: 'Tell your subscribers the video is live. Include the thumbnail image in the post.' },
      { id: '9-3', label: 'Shorts clip identified or cut', tooltip: 'Find the best 30-60 second moment. Repurpose it as a Short within 24 hours of publishing.' },
    ],
  },
]
