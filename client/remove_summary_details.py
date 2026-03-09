import codecs

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with codecs.open(driver_file, 'r', encoding='utf-8') as f:
    orig_content = f.read()

content = orig_content.replace('\ufeff', '')

start_idx = content.find('{/* CARD 1: PERSONAL DETAILS */}')
if start_idx == -1:
    print("CARD 1 not found")
else:
    end_idx = content.find('{/* CARD 2: ROLE & COMPENSATION */}', start_idx)
    card_content = content[start_idx:end_idx]
    
    # Let's find QID Number block
    qid_start = card_content.find('QID Number')
    qid_block_start = card_content.rfind('<div', 0, qid_start)
    
    # We want to remove QID, Date of Birth, Nationality, Gender
    # Let's remove from qid_block_start up to Mobile block
    mobile_start = card_content.find('Mobile')
    mobile_block_start = card_content.rfind('<div', 0, mobile_start)
    
    if qid_block_start != -1 and mobile_block_start != -1:
        new_card_content = card_content[:qid_block_start] + card_content[mobile_block_start:]
        
        new_content = content[:start_idx] + new_card_content + content[end_idx:]
        with codecs.open(driver_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully removed QID, DOB, Nationality, and Gender from Personal Details card")
    else:
        print("Could not find the blocks to remove within CARD 1")
