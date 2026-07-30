"""Article bodies for the data-migration guide cluster, split across three files
so each stays editable. See build_migration_guides.py."""
import mig_part1, mig_part2, mig_part3


def load(add):
    mig_part1.load(add)
    mig_part2.load(add)
    mig_part3.load(add)
