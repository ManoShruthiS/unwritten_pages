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
  },
  {
    id: 'entry-codebook-part-2',
    diaryId: 'diary-the-code-book',
    sectionId: 'sec-ciphers',
    entryNumber: 'Entry 002',
    title: 'When the Alphabet Started Playing Hide and Seek',
    subtitle: 'My Thoughts After Reading the Next Part of Chapter 1 of The Code Book',
    publishedDate: 'August 5, 2026',
    updatedDate: 'August 5, 2026',
    readingTime: '5 min read',
    tags: ['Cryptography', 'History', 'Book Summary'],
    coverImage: '/alphabet_hide_seek.png',
    previewParagraph: '"The more I read this book, the more I realized that history wasn\'t just fought with swords. Sometimes... it was fought with letters."',
    content: `> "The more I read this book, the more I realized that history wasn't just fought with swords. Sometimes... it was fought with letters."

When I started this part of the chapter, I thought I was finally entering the "technical zone." I was mentally preparing myself for difficult terms, confusing examples, and at least three moments where I'd stare at the page pretending I understood everything.

Surprisingly...
Simon Singh had other plans.

Instead of making cryptography feel complicated, he made me feel like I was watching thousands of years of human creativity unfold one idea at a time.

The first thing that caught my attention was that cryptography isn't just one magical trick. The author introduces two different ways of protecting a message: transposition and substitution.

At first, the word transposition sounded intimidating. Then the explanation made me smile. The letters themselves don't change at all they simply change places.

My brain immediately imagined the alphabet playing musical chairs.
Same people.
Different seats.
Suddenly, nobody understands what's going on.

That tiny idea amazed me because it proved that sometimes you don't need to create something new to confuse people. Sometimes changing the arrangement is enough.

But the author also points out something I hadn't thought about. If you completely scramble every letter randomly, even the person who is supposed to read the message won't know how to put it back together. That made me realize that a secret isn't useful unless the right person can actually understand it. 

> A clever system isn't just about hiding information it's about making sure the intended receiver can recover it.

The Rail Fence Cipher made this even easier for me to picture. Instead of throwing letters everywhere, they followed a simple pattern that both the sender and receiver already knew. Reading that example reminded me that cryptography has always depended on trust and agreement as much as intelligence.

Then came one of my favourite historical moments.
The Spartan Scytale.

I'll be honest...
When I first read about soldiers wrapping a strip of leather around a wooden staff to hide a message, I stopped for a second.

Thousands of years ago...
No laptops.
No encryption software.
Just a wooden stick and a brilliant idea.

History really looked at a piece of wood and said,
> "Congratulations. You're now a military security device."

And somehow...
It worked.

That made me appreciate something this chapter quietly keeps teaching me: technology changes, but human creativity doesn't.

Just when I thought I understood how secrets were protected, the author introduced another completely different idea—substitution.

Unlike transposition, where letters simply move around, substitution gives every letter a new identity. The message stays in the same order, but each character wears a disguise.

I actually liked how clearly the author compared these two ideas…
One changes position…
The other changes identity…

That simple comparison stayed in my mind much better than any definition could have.

The historical examples made this even more enjoyable. Somehow, that made the subject feel alive instead of technical. It reminded me that protecting information wasn't limited to one civilization or one purpose. Different societies solved the same problem in surprisingly creative ways.

The Caesar Cipher was probably the easiest concept for me to visualize. Shifting every letter a fixed number of places sounds almost too simple today, yet it was clever enough to protect military communication in its time.

It also introduced two words that I had seen before but never truly understood.
Plaintext.
Ciphertext.

The author explains them so naturally that they finally clicked.
Plaintext is simply the original message before encryption.
Ciphertext is the secret version after encryption.

Sometimes all we need is someone to explain things without trying to sound complicated.

Then came two words that used to confuse me every single time:
Algorithm and Key.

For the longest time, they sounded almost identical in my head.
This chapter finally separated them.

The algorithm is the overall method the set of rules used to encrypt a message.
The key is the specific secret that tells you exactly how to use that method.

The comparison that formed in my mind was simple.
> The algorithm is the recipe…
> The key is the secret ingredient…

Anyone can own the cookbook.
Without the secret ingredient...
Good luck making the same dish.

That tiny realization made these technical words much easier to remember.

Then the chapter introduced one of the most interesting ideas so far
Kerckhoffs' Principle.

I'll admit...
My first reaction was,
"Wait... shouldn't we keep the whole system secret?"

But the author's explanation completely changed my thinking.
A strong cryptographic system shouldn't depend on hiding the method itself.
It should remain secure even if everyone knows how it works.
The only thing that truly needs to stay secret is the key.

The more I thought about it, the more brilliant it sounded.
If your security collapses the moment someone understands the system...
Maybe the system wasn't truly secure in the first place.

Another thing these pages made me appreciate was the importance of having many possible keys. The author compares systems with only a few possible keys to those with unimaginably large numbers of possible keys, making it clear why attackers can't simply try every possibility. I found myself staring at those enormous numbers thinking,
> "My calculator just resigned from the job."

The discussion about using a keyword or keyphrase also made me smile. Instead of memorizing an entire scrambled alphabet, people could remember a meaningful word or phrase to build it. Such a small idea, yet incredibly practical. Sometimes convenience is part of good design.

Just when I thought the chapter had finished teaching me about creating ciphers, it took an unexpected turn.

It introduced the people who wanted to break them.
The Arab Cryptanalysts.

This was probably my favourite section because it reminded me that every great invention eventually inspires someone curious enough to challenge it.

The chapter describes how the growth of knowledge, libraries, scholarship, and careful study during the Islamic Golden Age created the perfect environment for a new science: cryptanalysis.

I loved that this breakthrough didn't happen because of luck.
It happened because people kept learning.
Mathematics, Language, Statistics, History.
Everything came together.
That was genuinely inspiring.

Then came Al-Kindi.
Out of all the names in these pages, his stood out the most for me.

While everyone else looked at encrypted messages as impossible puzzles, Al-Kindi looked at language itself.
His idea became known as frequency analysis, and honestly, I thought it sounded far more complicated than it actually was.

The explanation surprised me because it relied on a very simple observation:
Some letters naturally appear more often than others.

Instead of trying billions of possible keys one by one, Al-Kindi realized that studying how often symbols appeared could reveal hidden patterns.

I actually laughed when I reached this part.
Everyone else:
"This cipher is impossible!"
Al-Kindi:
"Let's count the letters first."

Sometimes genius isn't about making things more complicated.
Sometimes it's about noticing what everyone else ignores.

The author also honestly explains that frequency analysis isn't perfect. It works much better with longer pieces of text because they follow normal language patterns more closely. Very short or unusual texts can break those patterns, making the method much less reliable. I appreciated that balance it wasn't presented as magic, but as a powerful tool with strengths and limitations.

By the end of these pages, I realized something I hadn't expected.

I wasn't simply reading about ciphers anymore.
I was watching a battle between two kinds of minds.

One side kept inventing stronger ways to protect secrets.
The other kept inventing smarter ways to uncover them.

Neither side ever truly wins.
They simply make each other better.

And honestly...
That's exactly why I couldn't stop turning the pages.

I started this section expecting to learn a few encryption techniques.
I finished it with a much bigger lesson.

Human curiosity is impossible to encrypt.

Because no matter how strong the lock becomes...
Someone, somewhere, will always ask,
> "There has to be a way to open it."`,
    slug: 'when-the-alphabet-started-playing-hide-and-seek',
    isPinned: false,
    isFeatured: false
  },
  {
    id: 'entry-codebook-part-3',
    diaryId: 'diary-the-code-book',
    sectionId: 'sec-ciphers',
    entryNumber: 'Entry 003',
    title: 'Every Letter Leaves a Footprint',
    subtitle: 'My Thoughts After Reading the Next Part of Chapter 1 of The Code Book',
    publishedDate: 'August 5, 2026',
    updatedDate: 'August 5, 2026',
    readingTime: '6 min read',
    tags: ['Cryptography', 'History', 'Book Summary'],
    coverImage: '/every_letter_footprint.png',
    previewParagraph: '"I used to think breaking a secret meant being lucky. These pages quietly convinced me that it\'s actually about noticing what everyone else ignores."',
    content: `> "I used to think breaking a secret meant being lucky. These pages quietly convinced me that it's actually about noticing what everyone else ignores."

When I reached this part of The Code Book, I honestly thought the author was finally going to throw me into pages filled with impossible puzzles and mathematical headaches.

Instead...
he handed me a mystery.
And then calmly said,
> "Let's solve it together."

That simple decision completely changed the way I experienced these pages.

One thing I loved was that the author didn't just tell me what frequency analysis is he actually let me watch it happen. Reading the encrypted paragraph for the first time, I had exactly one thought:
"Yeah... good luck with that."
It looked like someone had challenged the alphabet to hide from humanity forever.

Then the chapter slowly reminded me that even the best disguise leaves tiny clues behind.

That was my first big realization.
The cryptanalyst doesn't begin by guessing.
The cryptanalyst begins by observing.

That difference stayed with me.

Instead of attacking the entire puzzle at once, the author patiently breaks it into smaller questions. Which letters appear most often? Which letters like to sit next to almost everyone? Which ones seem surprisingly antisocial? It almost felt as if every letter had its own personality.

I actually laughed thinking,
"So the alphabet has social habits now?"

Surprisingly...
it does.
And those habits become clues.

One explanation I genuinely enjoyed was how the author compared vowels and consonants through their behavior instead of simply defining them. Some letters naturally appear beside many others, while some are much more selective. I had never looked at language that way before. After reading those pages, I caught myself wondering if every paragraph I've ever written secretly contains patterns I never noticed.

Another moment that impressed me was how much progress came from something incredibly small.
One-letter words.

That's it.
A tiny clue.

Yet it became one of the keys that unlocked the larger puzzle.
It reminded me that intelligence isn't always about finding the biggest answer.
Sometimes...
it's about asking the smallest question.

As more clues appeared, the encrypted message slowly stopped looking like random symbols and started looking like a conversation waiting to be understood. I loved that feeling because the chapter never made cryptanalysis seem like magic. Every breakthrough felt earned. Every new letter was another piece of a puzzle carefully falling into place.

One sentence from this section quietly changed my perspective.
The author explains that successful cryptanalysis isn't built only on logic. It also requires intuition, flexibility, and educated guesswork.

I actually appreciated that.
Sometimes books accidentally make intelligence look effortless.
This one didn't.

It reminded me that even experts occasionally begin with,
"I think this might fit..."
before proving that they're right.
That felt surprisingly human.

The chapter then zooms out from one puzzle to the bigger story behind it. I enjoyed learning that the growth of scholarship during the Islamic Golden Age created the perfect environment for cryptanalysis to flourish. Reading about libraries, translation, mathematics, language, and careful observation working together reminded me that great discoveries rarely happen inside a single subject. They happen when different fields start talking to each other.

Out of everyone introduced in these pages, Al-Kindi fascinated me the most.
Not because he had access to extraordinary technology.
But because he trusted observation.

While others might have seen an impossible cipher, he saw patterns hiding in plain sight. His explanation of frequency analysis made me realize that sometimes solving a difficult problem isn't about working harder it's about looking differently.

I smiled when that idea finally clicked.
Everyone else looked at thousands of strange symbols.
Al-Kindi looked at how often they appeared…

Same message.
Completely different way of thinking.

The author also does something I really respect.
He doesn't pretend frequency analysis is perfect.
He openly explains that shorter or unusual texts can behave differently, making the method much harder to apply. I liked that honesty because it reminded me that even brilliant techniques have limitations. Good ideas become even more believable when someone is willing to admit where they don't always work.

As the chapter moved into the Renaissance, another thought stayed with me.
Knowledge doesn't stay in one place forever.
Ideas travel.
They evolve.
They inspire someone else.

Reading about European cryptographers and cryptanalysts made me realize that the battle between protecting secrets and uncovering them had become bigger than any one civilization. It had become a shared human challenge.

I also found the discussion about codes, ciphers, and nomenclators surprisingly useful. Before this chapter, I honestly used the words "code" and "cipher" as if they meant exactly the same thing. The author patiently explained the difference, and suddenly a distinction I had ignored for years finally made sense. Those are the moments I enjoy most while reading—when something I thought I understood quietly becomes much clearer.

One detail that made me smile was the idea of adding nulls symbols that mean absolutely nothing just to confuse anyone trying to crack the message.
Imagine spending hours solving a puzzle...
only to discover someone secretly added extra pieces that belong to a different box.

That level of mischief deserves some respect.

By the end of this section, I realized I wasn't reading a book about encryption anymore.
I was reading a story about curiosity.

Every stronger cipher inspired a smarter cryptanalyst.
Every successful cryptanalyst forced someone to invent a better cipher.
Neither side stayed ahead forever.
They simply pushed each other to think harder.

And honestly...
that might be my favorite lesson from these pages.

I began this reading expecting to learn how people protected secrets.
I finished it realizing something much bigger.
A secret isn't defeated by strength alone.

> Sometimes it's defeated by someone patient enough to notice the smallest pattern everyone else overlooked.

That thought made me close the book for a moment.
Not because I was finished reading.
But because I wanted to appreciate just how powerful careful observation can be.`,
    slug: 'every-letter-leaves-a-footprint',
    isPinned: false,
    isFeatured: false
  }
];
