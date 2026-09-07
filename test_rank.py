def check_rank(accuracyPercent):
    if accuracyPercent >= 90:
        return {'rank': 'S'}
    if accuracyPercent >= 80:
        return {'rank': 'A'}
    if accuracyPercent >= 68:
        return {'rank': 'B'}
    return {'rank': 'C'}

print(check_rank(90))
print(check_rank(85))
print(check_rank(68))
print(check_rank(50))
