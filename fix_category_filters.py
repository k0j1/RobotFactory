import re

with open('src/components/minigames/MinigameDashboard.tsx', 'r') as f:
    content = f.read()

# Replace the flex-wrap with overflow-x-auto whitespace-nowrap and hide scrollbar
old_filter = r'<div className="flex flex-wrap items-center gap-1\.5 p-1 bg-\[#ece1d3\] border border-\[#c5a786\] rounded-xl shadow-inner w-full sm:w-auto">'
new_filter = '<div className="flex overflow-x-auto whitespace-nowrap custom-scrollbar items-center gap-1.5 p-1 bg-[#ece1d3] border border-[#c5a786] rounded-xl shadow-inner w-full sm:w-auto">'
content = content.replace(old_filter, new_filter)

# Remove the count in "すべて"
old_subete = r'すべて \(\{categoryStats\.reduce\(\(acc, c\) => acc \+ c\.games\.length, 0\)\}種目\)'
new_subete = 'すべて'
content = content.replace(old_subete, new_subete)

# We should also ensure the buttons don't shrink too much
content = content.replace('flex items-center gap-1 cursor-pointer', 'flex items-center gap-1 cursor-pointer shrink-0')

with open('src/components/minigames/MinigameDashboard.tsx', 'w') as f:
    f.write(content)
