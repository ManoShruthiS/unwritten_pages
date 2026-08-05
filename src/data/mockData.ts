import { Diary, JournalEntry } from '../types';

export const INITIAL_DIARIES: Diary[] = [
  {
    id: 'diary-the-code-book',
    slug: 'the-code-book',
    title: 'The Code Book',
    description: 'Summaries, secret ciphers, and key takeaways from the science of secrecy and cryptography.',
    icon: 'Lock',
    coverColor: '#1c2e3b',
    spineColor: '#101b24',
    accentColor: '#d4af37',
    entryCount: 1,
    lastUpdated: 'Today',
    isPinned: true,
    sections: [
      { id: 'sec-ciphers', name: 'Classical Ciphers' },
      { id: 'sec-enigma', name: 'Enigma & WWII' },
      { id: 'sec-quantum', name: 'Public Keys & Quantum Crypto' }
    ]
  }
];

export const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-codebook-intro',
    diaryId: 'diary-the-code-book',
    sectionId: 'sec-ciphers',
    entryNumber: 'Entry 001',
    title: 'The Queen Who Trusted a Cipher More Than Humans',
    subtitle: 'A historical perspective on cryptography',
    publishedDate: 'August 4, 2026',
    updatedDate: 'August 5, 2026',
    readingTime: '5 min read',
    tags: ['Cryptography', 'History', 'Book Summary'],
    coverImage: '/queen_cipher_codebook.png',
    previewParagraph: '"Sometimes, the strongest lock isn\'t made of steel. It\'s made of symbols. And sometimes... even that isn\'t enough."',
    content: `"Sometimes, the strongest lock isn't made of steel. It's made of symbols. And sometimes... even that isn't enough."

When I picked up *The Code Book*, I expected to meet algorithms before humans. Honestly, I was mentally preparing for complicated encryption techniques, mathematical formulas, and enough technical terms to make me reread every sentence twice.

Instead, Simon Singh looked at me and almost seemed to say,
"Forget the equations for a moment... let me tell you about a queen whose life depended on a secret."

Safe to say... He had my attention.

The introduction immediately reminded me that long before smartphones, emails, or encrypted chats existed, people were already fighting a different kind of war. Kings, queens, and generals weren't just worried about winning battles—they were worried about their messages falling into the wrong hands. One intercepted letter could expose military plans, betray allies, or destroy years of careful planning.

Reading this made me smile.

We've upgraded from horses to airplanes.
From handwritten letters to instant messages.
From wax tablets to smartphones.

But humanity apparently never upgraded from saying,
"Please... don't let the wrong person read this."

That thought made the introduction feel surprisingly modern.

One comparison from these pages stayed with me. The author compares codes to living organisms. Every time a codebreaker discovers a weakness, the old code slowly disappears and a stronger one takes its place. It felt less like reading history and more like watching an endless chess match.

One side smiles and says,
"Finally... an unbreakable code."

The other quietly replies,
"Are you sure?"

And the game begins all over again.

Then came the moment that completely pulled me into the chapter.

I thought I was opening a book about cryptography.
Turns out...
I was opening a courtroom door.

Instead of beginning with definitions, Simon Singh introduces Mary Queen of Scots.

Imagine walking into a courtroom knowing that your future depends on whether someone can read a few letters you wrote months ago.
That was Mary's reality.

She wasn't simply accused of treason. She was accused of plotting to assassinate Queen Elizabeth. The conspirators had already been arrested. Confessions had already been collected. Everything seemed to point toward one unavoidable conclusion.

Except...
Mary still had hope.

Not because an army would rescue her.
Not because the judges would suddenly become merciful.

She believed her greatest protection was something much quieter.
A cipher.

At this point, I paused for a second.
Would I trust a few strange symbols with my life?
Honestly...
I don't know.

Every letter she exchanged had been encrypted. If nobody could understand those strange symbols, nobody could prove her involvement.

For a moment, I almost found myself believing with her.
"As long as they can't read it... I'm safe."

Then the chapter introduces Thomas Phelippes.

That was the moment I stopped seeing him as just another historical figure.
I saw him as history's version of someone who could unlock a phone without knowing the password.
Different century.
Same nightmare.

You know that feeling in a movie when a new character appears and you instantly think,
"Yeah... this person is about to change everything."
That was exactly my reaction.

Phelippes wasn't carrying a sword.
He wasn't leading an army.

His weapon was something far more dangerous.
He knew how to read what wasn't supposed to be read.

At that moment, this stopped feeling like a history lesson.
It started feeling like one of the earliest battles between someone trying to protect information and someone determined to uncover it.

Just when I thought the chapter couldn't surprise me again, it travelled all the way back to ancient Greece.

That's when I realized humans have always been unbelievably creative when it comes to protecting secrets.

One message was written beneath a layer of wax on a wooden tablet so that it appeared completely blank. Only after the wax was removed could the hidden warning be read.

Imagine being the guard checking it.
"Looks blank."
"Nothing suspicious."

History quietly smiled.

Then came my favorite example.

A messenger had his head shaved. The message was written directly on his scalp. Everyone waited for his hair to grow back before sending him on his journey.

I actually laughed.
"Is the mission urgent?"
"Very."
"Then why are we waiting?"
"His hair hasn't finished growing yet."

Ancient spies clearly had a level of patience I don't think I could ever achieve.
I start checking the loading bar if a website takes five seconds.
These people waited for hair.

One concept I found particularly interesting was the difference between hiding a message and hiding its meaning. Before reading this chapter, I honestly never thought those were two different ideas. The explanation was simple enough that it immediately clicked in my mind, and I found myself appreciating how carefully the author introduces complex concepts without making them intimidating.

I also enjoyed how the chapter kept reminding me that creativity isn't limited by technology. Some of the historical methods mentioned were so imaginative that I caught myself smiling and wondering how people even came up with those ideas in the first place.

It reminded me that human curiosity has always been one of our greatest inventions.

Perhaps my biggest takeaway wasn't a technical concept at all.
It was this:

Technology usually begins with a human problem.

Before there were computers, there were people trying to protect trust.
Before there were algorithms, there were people trying to protect conversations.
Before there was cybersecurity, there were ordinary humans searching for extraordinary ways to keep secrets safe.

That perspective completely changed how I look at cryptography.

Instead of seeing it as a computer science topic, I now see it as a fascinating chapter in human history.

By the time I finished this reading session, I wasn't thinking about codes.
I was thinking about people.
About the choices they made.
About the risks they took.
And about how one hidden message could quietly change the course of history.

If the opening pages of The Code Book managed to make me think this much before diving into the deeper technical ideas, I'm genuinely excited to continue reading.

Because I have a feeling this book isn't just going to teach me how secrets are protected.
It's going to teach me why humans have never stopped trying to protect them…`,
    slug: 'the-queen-who-trusted-a-cipher',
    isPinned: true,
    isFeatured: true
  }
];
